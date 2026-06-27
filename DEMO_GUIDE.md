# Guía de Demo — Yachay AI Hackathon

## URL del demo (sin backend, funciona siempre)
```
https://frontend-gules-three-89.vercel.app/chat?scenario=mercado&demo=1
```
Usa respuestas pre-escritas — no depende del backend, nunca falla. Abrila en Chrome o Edge.

---

## Qué se ve en la pantalla durante el demo

| Elemento | Dónde aparece | Qué hace |
|---|---|---|
| **🔥 7** | Header derecho | Racha de 7 días consecutivos de práctica |
| **🦙 Pacha** | Header derecho | Mascota que salta cuando Yachay piensa y manda burbujas de texto |
| **🔊** | Header derecho | Botón de voz — Yachay habla en voz alta |
| **NV 3 · Conocedor** | Debajo del header | Nivel actual con barra de XP dorada |
| **+20 XP / +30 XP...** | Flotando abajo a la derecha | Animación que aparece con cada respuesta |
| **LOGRO DESBLOQUEADO** | Centro inferior | Toast que aparece en el turno 4: "Nivel 4: Experto" |

---

## Script de la conversación — escribí EXACTAMENTE esto en orden

| # | Lo que escribís | Lo que pasa |
|---|---|---|
| — | *(Yachay saluda solo al abrir)* | Pacha salta. +20 XP. Burbuja: "Kausachun quechua!" |
| 1 | `Allin kachkani, yupaychani` | +30 XP. Burbuja: "¡Lo estas haciendo bien!" |
| 2 | `Mansanata munani` | +30 XP. Burbuja: "¡Un paso mas!" |
| 3 | `Iskay mansana munani` | Tarjeta de corrección. +50 XP. **Toast: "Nivel 4: Experto"** |

Practica los 4 turnos una vez antes de grabar para saber el timing.

---

## Video de 2 minutos — Estructura y guion

### 0:00 – 0:25 | El problema (cámara o slide de fondo)
> "Bolivia tiene 36 idiomas originarios — quechua, aymara, guaraní — reconocidos por la Constitución.
> Millones de bolivianos los hablan, pero el 67% son mayores de 40 años.
> La transmisión intergeneracional se rompe. Y Duolingo, Babbel y Rosetta Stone no los incluyen.
> Cada año, una cultura entera se pierde en silencio."

### 0:25 – 0:50 | La solución (cámara o slide)
> "Desarrollamos Yachay AI — un tutor conversacional con inteligencia artificial
> que te enseña quechua, aymara y guaraní practicando situaciones reales:
> el mercado, el centro de salud, trámites.
> Yachay corrige tus errores, los explica, habla con vos,
> y te motiva con un sistema de progreso gamificado."

### 0:50 – 2:00 | Demo en vivo (pantalla completa, modo demo)
1. **(0:50)** Abrí la URL del demo — mostrá el header con la racha, la barra de XP y Pacha
2. **(1:00)** Señalá "NV 3 · Conocedor" y "🔥 7 días"
3. **(1:05)** Yachay ya saludó — señalá el +20 XP flotando y la burbuja de Pacha
4. **(1:20)** Escribí: `Allin kachkani, yupaychani` → Enter — señalá el +30 XP
5. **(1:35)** Escribí: `Mansanata munani` → Enter
6. **(1:45)** Escribí: `Iskay mansana munani` → Enter → **esperá el toast "Nivel 4: Experto"** → señalalo
7. **(1:55)** Mostrá el botón 🎤 y decí: "También podés hablarle directamente"

### Cierre (últimos 5 seg)
> "Yachay. Porque aprender un idioma es conectar con una cultura."

---

## Pitch de 3 minutos — Estructura

| Bloque | Tiempo | Qué decir |
|---|---|---|
| **Gancho** | 0:00–0:20 | "¿Cuántos hablan quechua?" — pausa — "¿Por qué tan pocos jóvenes?" |
| **Problema** | 0:20–0:50 | 36 idiomas, 67% hablantes mayores de 40, cero apps dedicadas |
| **Solución** | 0:50–1:20 | Yachay AI — escenarios reales, voz, correcciones, gamificación |
| **Demo** | 1:20–2:20 | Mismos 4 turnos del demo + mostrar el toast de nivel |
| **Impacto** | 2:20–2:45 | Escuelas EIB, turismo, escalable a los 36 idiomas |
| **Cierre** | 2:45–3:00 | "Yachay significa aprender en quechua. Esto es Yachay." |

---

## Preguntas del jurado — posibles respuestas

**¿Por qué no usan Gemini si es un hackathon de Google?**
> "Usamos Firebase de Google para autenticación y base de datos. El modelo de lenguaje es LLaMA vía Groq porque al momento del desarrollo ofrecía la latencia más baja para respuestas en tiempo real — por debajo de 1 segundo. La arquitectura soporta swapear el modelo fácilmente."

**¿Cómo escalan a los 36 idiomas?**
> "La arquitectura es completamente agnóstica al idioma. Solo se actualiza el system prompt del tutor. Ya tenemos quechua, aymara y guaraní. Sumar mojeño o chipaya es cuestión de días, no meses."

**¿Tienen datos de precisión lingüística?**
> "El modelo fue entrenado con datos multilingües que incluyen quechua y aymara. Para el hackathon validamos los ejemplos con hablantes nativos del equipo y consultamos el diccionario oficial del IPELC."

---

## Checklist antes de grabar

- [ ] Abrí la URL del demo en Chrome o Edge (no Safari — la voz puede no funcionar)
- [ ] Probá los 4 turnos una vez completo para verificar timing
- [ ] Subí el brillo de la pantalla al máximo
- [ ] Activá modo no molestar en la computadora
- [ ] Activá el audio de Yachay (🔊 debe estar dorado) para que se escuche en el video
- [ ] Grabá en horizontal si es pantalla compartida

---

*Yachay AI — Build with AI La Paz 2026*
