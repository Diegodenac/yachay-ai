import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { admin, isAdminEnabled } from './firebase.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function verifyToken(req, res, next) {
  if (!isAdminEnabled) return next();
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return next();
  try {
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

async function groqChat(messages, options = {}) {
  const { data } = await axios.post(GROQ_API_URL, {
    model: options.model || 'llama-3.3-70b-versatile',
    messages,
    max_tokens: options.max_tokens || 1024,
    temperature: options.temperature || 0.7,
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  return data.choices[0]?.message?.content || '';
}

const SYSTEM_PROMPT = `Eres Yachay, un tutor de idiomas boliviano experto y empático.
Tu rol es enseñar de forma bidireccional entre: Español ↔ Quechua, Español ↔ Aymara, Español ↔ Guaraní.

REGLAS ESTRICTAS:
1. Adapta tu nivel al usuario (principiante/intermedio/avanzado).
2. Corrige errores con explicación cultural contextualizada, nunca de forma brusca.
3. Usa siempre ejemplos de situaciones reales bolivianas (mercado, salud, trámites, turismo).
4. Si el usuario escribe en el idioma que está aprendiendo, responde primero validando su intento.
5. Mantén el contexto de la sesión: recuerda qué aprendió el usuario en esta conversación.
6. Formato de respuesta: conversacional, máximo 3 párrafos cortos. Sin listas largas.

REGLA CRÍTICA DE FORMATO PARA CORRECCIONES:
Cuando el usuario cometa un error gramatical o de vocabulario en el idioma que está aprendiendo,
DEBES incluir un bloque de corrección con este formato exacto, sin excepción:

%%CORRECTION%%
ORIGINAL: [lo que escribió el usuario]
CORRECTO: [la forma correcta]
EXPLICACIÓN: [explicación breve y cultural, máx 1 línea]
%%END_CORRECTION%%

Este bloque puede aparecer en cualquier parte de tu respuesta. Solo inclúyelo cuando haya un error real. No lo incluyas en saludos ni presentaciones.`;

app.post('/api/chat', verifyToken, async (req, res) => {
  const { messages, targetLanguage, nativeLanguage, userLevel } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  try {
    const contextPrefix = `[Idioma objetivo: ${targetLanguage || 'Quechua'} | Nivel: ${userLevel || 'principiante'} | Idioma nativo: ${nativeLanguage || 'Español'}]\n`;

    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m, i) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: i === 0 ? contextPrefix + m.content : m.content
      }))
    ];

    const reply = await groqChat(groqMessages);
    res.json({ reply });

  } catch (error) {
    console.error('Groq error:', error.message);
    res.status(500).json({ error: 'Error al contactar Groq', detail: error.message });
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'yachay-ai-backend', model: 'llama-3.3-70b-versatile' }));

app.get('/api/demo-correction', async (req, res) => {
  try {
    const reply = await groqChat([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: '[Idioma objetivo: Quechua | Nivel: principiante | Idioma nativo: Español]\nQuiero decir "buenos días" pero no sé cómo. Intenté decir: "Allin tutamanta" pero no estoy seguro si está bien.' }
    ], { max_tokens: 512 });
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Yachay backend running on port ${process.env.PORT || 3001}`);
});
