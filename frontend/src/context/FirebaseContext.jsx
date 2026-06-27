import { createContext, useContext, useEffect, useState } from 'react'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { auth, isFirebaseEnabled } from '../firebase'

const FirebaseContext = createContext({ user: null, loading: false })

export function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isFirebaseEnabled)

  useEffect(() => {
    if (!isFirebaseEnabled) return

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        setLoading(false)
      } else {
        try {
          await signInAnonymously(auth)
        } catch (e) {
          console.warn('Firebase anon auth failed:', e.message)
          setLoading(false)
        }
      }
    })

    return unsub
  }, [])

  return (
    <FirebaseContext.Provider value={{ user, loading }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebase = () => useContext(FirebaseContext)
