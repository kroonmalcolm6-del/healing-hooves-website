import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bone:     "#F0EAE0",
        soil:     "#1E2B10",
        redoxide: "#C9A84A",
        shutter:  "#2A3D18",
        veldgold: "#C9A84A",
        healed:   "#3D5A20",
      },
      fontFamily: {
        display: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
        body:    ["\"Source Sans 3\"", "ui-sans-serif", "system-ui", "sans-serif"],
        mono:    ["\"IBM Plex Mono\"", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
