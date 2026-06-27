import {
  doc, collection, addDoc, updateDoc, setDoc,
  serverTimestamp, increment, getDoc,
} from 'firebase/firestore'
import { db, isFirebaseEnabled } from '../firebase'

export async function ensureUserProfile(uid, { targetLanguage, userLevel }) {
  if (!isFirebaseEnabled || !uid) return
  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        targetLanguage,
        userLevel,
        totalWordsLearned: 0,
        totalCorrections: 0,
        totalSessions: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else {
      await updateDoc(ref, { targetLanguage, userLevel, updatedAt: serverTimestamp() })
    }
  } catch (e) {
    console.warn('ensureUserProfile:', e.message)
  }
}

export async function createSession(uid, { scenario, targetLanguage, userLevel }) {
  if (!isFirebaseEnabled || !uid) return null
  try {
    const ref = await addDoc(collection(db, 'users', uid, 'sessions'), {
      scenario: scenario || null,
      targetLanguage,
      userLevel,
      messages: [],
      wordsLearned: 0,
      corrections: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return ref.id
  } catch (e) {
    console.warn('createSession:', e.message)
    return null
  }
}

export async function syncSession(uid, sessionId, { messages, wordsLearned, corrections }) {
  if (!isFirebaseEnabled || !uid || !sessionId) return
  try {
    await updateDoc(doc(db, 'users', uid, 'sessions', sessionId), {
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      wordsLearned,
      corrections,
      updatedAt: serverTimestamp(),
    })
  } catch (e) {
    console.warn('syncSession:', e.message)
  }
}

export async function finalizeSession(uid, { wordsLearned, corrections }) {
  if (!isFirebaseEnabled || !uid) return
  try {
    await updateDoc(doc(db, 'users', uid), {
      totalWordsLearned: increment(wordsLearned),
      totalCorrections: increment(corrections),
      totalSessions: increment(1),
      updatedAt: serverTimestamp(),
    })
  } catch (e) {
    console.warn('finalizeSession:', e.message)
  }
}

export async function getUserStats(uid) {
  if (!isFirebaseEnabled || !uid) return null
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? snap.data() : null
  } catch (e) {
    console.warn('getUserStats:', e.message)
    return null
  }
}
