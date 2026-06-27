// Happy-path demo script — activated with ?demo=1 in the URL
// 4 turns: greeting → vocabulary → practice → correction card

export const DEMO_RESPONSES = [
  // Turn 0 — initial greeting (mercado scenario)
  `¡Allin p'unchay! Bienvenido al mercado de Cochabamba.

Soy Yachay, tu tutor de quechua. Yo soy el casero (vendedor) y tú eres un turista boliviano que quiere practicar quechua.

Te enseñaré a comprar en el mercado paso a paso.

Empecemos: ¡Imaynallan kashanki! — ¿Cómo estás?`,

  // Turn 1 — user said "Allin kachkani, yupaychani"
  `¡Ancha allin! — ¡Muy bien dicho! 🎉

Acabas de usar dos frases clave:
• allin kachkani → "estoy bien"
• yupaychani → "gracias"

Ahora dime qué quieres comprar. En quechua las frutas son fáciles:
• mansana → manzana
• qamitu → tomate
• papa → papa (¡igual que en español!)

Prueba decir: "Mansanata munani" (Quiero manzanas)`,

  // Turn 2 — user said "Mansanata munani"
  `¡Perfectamente dicho! 🌟

Ya puedes pedir en el mercado. Sigamos:

¿Cuántas manzanas quieres? Los números en quechua:
• huk → uno
• iskay → dos
• kimsa → tres

Prueba: "Iskay mansanata munani" — Quiero dos manzanas`,

  // Turn 3 — user said "Iskay mansana munani" (missing -ta), triggers correction card
  `¡Casi perfecto, estás aprendiendo muy rápido!

%%CORRECTION%%
ORIGINAL: Iskay mansana munani
CORRECTO: Iskay mansanata munani
EXPLICACIÓN: En quechua el sufijo -ta marca el objeto directo. mansana + ta = mansanata. ¡Solo un pequeño detalle!
%%END_CORRECTION%%

¡Sumaq yachaq kanki! — ¡Eres un gran estudiante! Ya puedes hacer compras básicas en quechua en cualquier mercado de Bolivia.`,
]
