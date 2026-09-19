// Configuración de Tailwind compartida por todas las páginas.
// Los valores de color se leen de css/variables.css, donde cada variable
// guarda un triplete "R G B" (sin rgb() ni comas). Aquí se envuelven en
// rgb(var(--x) / <alpha-value>) porque es la sintaxis que exige Tailwind
// para que funcionen los modificadores de opacidad (bg-cream/50, text-ink/80...);
// con var(--x) a secas esos modificadores generan CSS inválido y el texto
// o fondo desaparece. Para cambiar colores, edita variables.css — no este archivo.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        sand: "rgb(var(--color-sand) / <alpha-value>)",
        beige: "rgb(var(--color-beige) / <alpha-value>)",
        tan: "rgb(var(--color-tan) / <alpha-value>)",
        sage: {
          50: "rgb(var(--color-sage-50) / <alpha-value>)",
          100: "rgb(var(--color-sage-100) / <alpha-value>)",
          light: "rgb(var(--color-sage-light) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-sage) / <alpha-value>)",
          dark: "rgb(var(--color-sage-dark) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
          soft: "rgb(var(--color-ink-soft) / <alpha-value>)",
        },
        border: "rgb(var(--color-border) / <alpha-value>)",
        whatsapp: "rgb(var(--color-whatsapp) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
      },
      boxShadow: {
        warm: "0 20px 45px -20px rgba(45, 41, 38, 0.25)",
      },
    },
  },
};
