# Guía de Demo — Yachay AI Hackathon

## URL del demo (sin backend, funciona siempre)
```
https://frontend-gules-three-89.vercel.app/chat?scenario=mercado&demo=1
```
Abrila en Chrome o Edge antes de grabar. No depende del backend — nunca falla.

---

## La historia del demo

**Vos no sabés hablar quechua. Yachay te enseña.**

Esa es la historia que los jurados tienen que ver: alguien que entra sin saber nada y en 2 minutos ya puede saludar y comprar en un mercado boliviano. No mostrar que ya sabés — mostrar que la IA te enseña.

---

## Script de la conversación — escribí EXACTAMENTE esto en orden

| # | Lo que escribís | Por qué |
|---|---|---|
| — | *(Yachay abre la escena solo)* | Te da la primera frase para repetir |
| 1 | `Allin p'unchay` | Repetís la frase que Yachay te acaba de enseñar |
| 2 | `Mansanata munani` | Repetís la frase que Yachay te enseñó para comprar |
| 3 | `Iskay mansana munani` | Intentás la frase de dos manzanas — te falta el -ta |

El turno 3 dispara la **tarjeta de corrección** y el **achievement "Nivel 4: Experto"**.

---

## Qué se ve en pantalla durante el demo

| Elemento | Descripción |
|---|---|
| **🔥 7** | Racha de 7 días en el header |
| **🦙 Pacha** | Mascota llama que salta mientras Yachay piensa y manda burbujas |
| **NV 3 · Conocedor** | Barra de XP dorada que sube con cada turno |
| **+XP flotante** | Número dorado que aparece abajo derecha con cada respuesta |
| **LOGRO DESBLOQUEADO — Nivel 4: Experto** | Toast que aparece ~1 seg después del turno 3 |

---

## Video de 2 minutos — Estructura y guion

### 0:00 – 0:25 | El problema
> "Bolivia tiene 36 idiomas originarios — quechua, aymara, guaraní.
> Millones de bolivianos los hablan, pero el 67% son mayores de 40 años.
> No hay apps para aprenderlos. Duolingo, Babbel, Rosetta Stone — ninguno los incluye.
> Cada año estos idiomas pierden hablantes jóvenes. Se están extinguiendo."

### 0:25 – 0:50 | La solución
> "Desarrollamos Yachay AI: un tutor conversacional con inteligencia artificial
> que te enseña quechua, aymara y guaraní desde cero, practicando situaciones reales.
> Yo no sé hablar quechua. Voy a mostrarte cómo Yachay me enseña en tiempo real."

### 0:50 – 2:00 | Demo en vivo
Abrí la URL del demo y seguí estos pasos:

1. **(0:50)** Mostrá la pantalla — señalá la barra de XP "NV 3 · Conocedor" y el "🔥 7"
2. **(0:58)** Yachay ya abrió la escena — dice: "Para saludar di: Allin p'unchay"
3. **(1:05)** Mirá a cámara y decí: *"No sé quechua — voy a repetir lo que me dice"*
4. **(1:10)** Escribí: `Allin p'unchay` → Enter — señalá el +30 XP flotante
5. **(1:20)** Yachay te enseña "Mansanata munani" — escribís: `Mansanata munani` → Enter
6. **(1:33)** Yachay te enseña "Iskay mansanata munani" — escribís: `Iskay mansana munani` → Enter
7. **(1:45)** Esperá el toast **"Nivel 4: Experto"** — señalalo — señalá también la tarjeta de corrección
8. **(1:55)** Decí: *"En menos de dos minutos aprendí a saludar y comprar en quechua"*

### Cierre (últimos 5 seg)
> "Yachay. Porque aprender un idioma es conectar con una cultura."

---

## Pitch de 3 minutos — Estructura

| Bloque | Tiempo | Contenido |
|---|---|---|
| **Gancho** | 0:00–0:20 | "¿Alguien aquí habla quechua?" — pausa — "¿Por qué tan pocos jóvenes lo hablan?" |
| **Problema** | 0:20–0:50 | 36 idiomas, 67% hablantes mayores de 40, cero apps en tiendas |
| **Solución** | 0:50–1:20 | Yachay AI — escenarios reales, voz, correcciones inteligentes, gamificación |
| **Demo** | 1:20–2:20 | Los 4 turnos del demo + mostrar achievement de nivel |
| **Impacto** | 2:20–2:45 | Escuelas EIB, turismo, escalable a los 36 idiomas reconocidos por la CPE |
| **Cierre** | 2:45–3:00 | "Yachay significa aprender en quechua. Esto es Yachay." |

---

## Preguntas del jurado — posibles respuestas

**¿Por qué no usan Gemini si es un hackathon de Google?**
> "Usamos Firebase de Google para autenticación y base de datos en tiempo real. Para el modelo de lenguaje elegimos LLaMA vía Groq porque en nuestras pruebas tenía latencia menor a 1 segundo, que es crítico para la experiencia conversacional. La arquitectura permite cambiar el modelo fácilmente."

**¿Cómo escalan a los 36 idiomas?**
> "La arquitectura es completamente agnóstica al idioma. Solo se actualiza el system prompt del tutor con el idioma objetivo. Ya tenemos quechua, aymara y guaraní. Añadir mojeño o chipaya es cuestión de días."

**¿Qué tan preciso es el quechua que genera la IA?**
> "El modelo fue entrenado con datos multilingües que incluyen quechua y aymara. Para el hackathon validamos los ejemplos con hablantes nativos del equipo y consultamos el diccionario del IPELC. Para producción planeamos un proceso de revisión con expertos lingüísticos."

---

## Checklist antes de grabar

- [ ] Abrí la URL del demo en Chrome o Edge (no Safari)
- [ ] Activá el botón 🔊 — debe estar dorado — para que Yachay hable en el video
- [ ] Practicá los 4 turnos una vez completo para saber el timing
- [ ] Subí el brillo de la pantalla al máximo
- [ ] Activá modo no molestar
- [ ] Grabá en horizontal si mostrás pantalla

---

*Yachay AI — Build with AI La Paz 2026*
