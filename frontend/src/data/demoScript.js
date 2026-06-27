// Happy-path demo script — activated with ?demo=1 in the URL
// Narrative: we don't know Quechua, Yachay teaches us from zero

export const DEMO_RESPONSES = [
  // Turn 0 — Yachay opens the mercado scene and teaches the first phrase
  `¡Bienvenido al mercado de Cochabamba! Soy Yachay, tu tutor de quechua.

Voy a enseñarte a hacer compras en quechua paso a paso. No necesitas saber nada — empezamos desde cero.

Para saludar al vendedor di: "¡Allin p'unchay!" — significa "¡Buenos días!". Pruébalo.`,

  // Turn 1 — user said "Allin p'unchay" (copied from Yachay)
  `¡Ancha allin! — ¡Muy bien dicho!

Ahora soy el vendedor. Yo te pregunto: ¿Imatam munankis? — ¿Qué quieres comprar?

Para responder "Quiero manzanas" di: "Mansanata munani"
• mansana = manzana
• munani = quiero

Pruébalo.`,

  // Turn 2 — user said "Mansanata munani" (copied from Yachay)
  `¡Perfectamente! Ya estás comprando en quechua.

Ahora dime cuántas manzanas quieres. Los números son fáciles:
• huk = uno  · iskay = dos  · kimsa = tres

Para decir "Quiero dos manzanas" di: "Iskay mansanata munani".
Pruébalo.`,

  // Turn 3 — user said "Iskay mansana munani" (missing -ta), triggers correction card
  `¡Casi perfecto, un pequeño detalle!

%%CORRECTION%%
ORIGINAL: Iskay mansana munani
CORRECTO: Iskay mansanata munani
EXPLICACIÓN: En quechua el sufijo -ta marca el objeto directo. mansana + ta = mansanata.
%%END_CORRECTION%%

¡Sumaq yachaq kanki! — ¡Eres un gran estudiante! En menos de dos minutos aprendiste a saludar y a comprar en quechua en un mercado boliviano.`,
]
