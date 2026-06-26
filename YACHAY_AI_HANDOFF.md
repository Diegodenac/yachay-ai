# YACHAY AI — HANDOFF
**Tutor Intercultural Boliviano | Build with AI La Paz 2026**

---

## 1. ESTADO ACTUAL

| Componente | Estado | Notas |
|---|---|---|
| `backend/index.js` | ✅ LISTO | Express + Gemini SDK configurado. Corre en puerto 3001. |
| `backend/.env` | 🔴 BLOQUEADO | GEMINI_API_KEY con cuota agotada (free tier, limit: 0). Requiere nueva key. |
| `frontend/` (scaffold) | ✅ LISTO | Vite + React JS + Tailwind CSS v4 instalados. |
| `frontend/pages/` | ⚠️ PENDIENTE | Onboarding, Chat, Simulation generados pero sin verificar por bloqueo de cuota. |
| Firebase | ⚠️ PENDIENTE | No configurado. Sprint 4. |
| Deploy | ⚠️ PENDIENTE | No iniciado. Vercel (frontend) + Railway (backend). |

---

## 2. BLOQUEADOR CRÍTICO — RESOLVER PRIMERO

**Problema:** La `GEMINI_API_KEY` en `backend/.env` pertenece a un proyecto GCP en free tier con cuota diaria agotada. Error retornado: `429 Too Many Requests` con `limit: 0`.

### Opción A — Nueva API key (sin costo inmediato)
1. Ir a https://aistudio.google.com/apikey
2. Crear key nueva en un proyecto GCP **distinto** al `Default Gemini Project`
3. Reemplazar el valor en `yachay-ai/backend/.env`

### Opción B — Habilitar billing (recomendado para hackathon)
1. Ir a https://console.cloud.google.com
2. Seleccionar el proyecto vinculado a tu key → Billing → Enable
3. Google otorga $300 USD en crédito gratuito — suficiente para 48h
4. Modelo ya configurado en `backend/index.js`: `gemini-2.0-flash`

---

## 3. ARQUITECTURA TÉCNICA

### Stack
- **Frontend:** Vite + React JS + Tailwind CSS v4 → `http://localhost:5173`
- **Backend:** Node.js + Express → `http://localhost:3001`
- **LLM:** Gemini 2.0 Flash (via `@google/generative-ai` SDK)
- **Auth/DB:** Firebase (pendiente — Sprint 4)
- **Deploy target:** Vercel (frontend) + Railway (backend)

### Estructura de archivos
```
yachay-ai/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Onboarding.jsx   # Selector idioma/nivel
│       │   ├── Chat.jsx         # Chat tutor principal
│       │   └── Simulation.jsx   # 4 escenarios situacionales
│       ├── App.jsx              # React Router rutas
│       ├── main.jsx             # Entry point + BrowserRouter
│       └── index.css            # Variables globales + reset
└── backend/
    ├── index.js                 # Express server + Gemini
    ├── .env                     # GEMINI_API_KEY + PORT=3001
    └── package.json             # type: module
```

### Endpoint principal
```
POST http://localhost:3001/api/chat

Body:
{
  messages: [{ role: "user"|"assistant", content: "..." }],
  targetLanguage: "Quechua"|"Aymara"|"Guaraní",
  userLevel: "principiante"|"intermedio"|"avanzado",
  nativeLanguage: "Español"
}

Response: { reply: string }

Health check: GET http://localhost:3001/health
→ { "status": "ok", "service": "yachay-ai-backend" }
```

---

## 4. SETUP EN MÁQUINA NUEVA

**Prerequisitos:** Node.js 18+, Git, GEMINI_API_KEY válida (ver Sección 2)

```bash
# Clonar
git clone https://github.com/[ORG]/yachay-ai.git
cd yachay-ai

# Backend
cd backend
npm install
echo "GEMINI_API_KEY=AIza..." > .env
echo "PORT=3001" >> .env
npm run dev

# Frontend (nueva terminal)
cd ../frontend
npm install
npm run dev

# Verificar backend
curl http://localhost:3001/health
# Esperado: {"status":"ok","service":"yachay-ai-backend"}
```

---

## 5. SPRINTS PENDIENTES

| Sprint | Estado | Descripción |
|---|---|---|
| Sprint 0: Setup | ✅ LISTO | Repo, dependencias, backend corriendo. |
| Sprint 1: Backend core | ✅ LISTO | Gemini integrado. Bloqueado por cuota, no por código. |
| Sprint 2: Frontend UI | ⚠️ PENDIENTE | Verificar Chat.jsx funciona tras resolver key. Ajustar UX. |
| Sprint 3: Simulaciones | ⚠️ PENDIENTE | 4 escenarios scaffoldeados. Probar con `?scenario=` param. |
| Sprint 4: Firebase | ⚠️ PENDIENTE | Auth anónima + Firestore para progreso de usuario. |
| Sprint 5: Polish + Demo | ⚠️ PENDIENTE | Flow demo end-to-end. Deploy. Preparar pitch. |

### Prioridad inmediata (Sprint 2)
Una vez resuelta la API key, verificar en DevTools → Network que `/api/chat` retorna 200. Si el mensaje de bienvenida no aparece en `Chat.jsx`, revisar el `useEffect` inicial — el historial podría enviarse con formato incorrecto al SDK de Gemini.

---

## 6. TOKENS DE DISEÑO

| Token | Valor |
|---|---|
| Fondo | `#0A0A0A` |
| Acento primario | `#F5A623` (amarillo boliviano) |
| Acento secundario | `#2E7D32` (verde andino) |
| Superficie | `#1E1E1E` |
| Texto principal | `#FFFFFF` |
| Texto secundario | `#AAAAAA` |
| Tipografía | Inter (Google Fonts) |
| Max-width | `480px` (mobile-first, centrado en desktop) |

---

## 7. PROMPT PARA CLAUDE CODE

Posicionarse en `yachay-ai/` y pegar:

```
CONTEXTO: Proyecto Yachay AI — hackathon 24-48h.
Backend Express en http://localhost:3001 (Gemini 2.0 Flash).
Frontend Vite+React en http://localhost:5173.

TAREA: Verificar que el flujo completo funciona: Onboarding → Chat → respuesta de Gemini visible.
Si Chat.jsx no muestra respuesta, debuggear el useEffect de bienvenida y el formato del array
messages que se envía al backend. Corregir sin cambiar la arquitectura.
Luego verificar /simulation con los 4 escenarios. Reportar estado de cada pantalla.

NO cambiar: stack, colores, modelo Gemini, estructura de archivos.
Solo corregir bugs y verificar flujo.
```

---

*Yachay AI — Build with AI La Paz 2026*
