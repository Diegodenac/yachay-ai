# Deploy Instructions — Yachay AI

## Estado actual

| Servicio | Plataforma | URL | Estado |
|---|---|---|---|
| Frontend | Vercel | https://frontend-gules-three-89.vercel.app | ✅ Deployado |
| Backend | Railway | https://backend-production-ef4f.up.railway.app | ✅ Deployado |

---

## Para el backend en Railway (requiere acceso al repo Diegodenac/yachay-ai)

El backend ya está deployado en Railway con el código subido manualmente.
Para conectarlo al repo de GitHub y que se auto-deploye con cada push:

### 1. Ir al proyecto en Railway
https://railway.com/project/c795b73b-b8c9-40a4-ba28-d1b7503ee65a/service/798984df-85af-4421-b256-35484f3ea467

### 2. Conectar el repo de GitHub
- Settings → Source → **Connect Repo**
- Seleccionar `Diegodenac/yachay-ai`
- **Root Directory**: `backend`
- Guardar

### 3. Verificar variables de entorno
Settings → Variables → confirmar que estas 3 variables existen:

```
GROQ_API_KEY=<copiá el valor del archivo backend/.env>
FRONTEND_URL=https://frontend-gules-three-89.vercel.app
PORT=3001
```

Si faltan, agregarlas manualmente en el dashboard.

### 4. Verificar que funciona
```
GET https://backend-production-ef4f.up.railway.app/health
→ { "status": "ok", "service": "yachay-ai-backend" }
```

---

## Para el frontend en Vercel (ya está deployado, solo para referencia)

El frontend está en la cuenta `melinagutierrez-5495s-projects` en Vercel.

Variables de entorno configuradas en Vercel:
```
VITE_API_URL=https://backend-production-ef4f.up.railway.app
```

Para redesployar manualmente:
```bash
cd frontend
vercel --prod --yes
```

---

## Para activar Firebase (opcional)

### Frontend — agregar en Vercel → Settings → Environment Variables:
```
VITE_FIREBASE_API_KEY=<de Firebase Console>
VITE_FIREBASE_AUTH_DOMAIN=<proyecto>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<proyecto>
VITE_FIREBASE_STORAGE_BUCKET=<proyecto>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<número>
VITE_FIREBASE_APP_ID=<app-id>
```

### Backend — agregar en Railway → Variables:
```
FIREBASE_PROJECT_ID=<proyecto>
FIREBASE_CLIENT_EMAIL=<service-account@proyecto.iam.gserviceaccount.com>
FIREBASE_PRIVATE_KEY=<-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n>
```

Después redesployar ambos para que tomen los nuevos valores.

---

## Arquitectura de datos (Firestore)

```
users/{uid}
  targetLanguage, userLevel
  totalWordsLearned, totalCorrections, totalSessions

users/{uid}/sessions/{sessionId}
  messages[], wordsLearned, corrections
  scenario, targetLanguage, userLevel, createdAt
```

Reglas de seguridad en `firestore.rules` — subir desde Firebase Console → Firestore → Rules.

---

*Yachay AI — Build with AI La Paz 2026*
