import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ---- Karoo-vernacular palette (swap these 6 hexes to re-theme the whole site) ----
        bone: "#F2EDE1", // limewashed wall — background
        soil: "#2B2420", // dark soil — primary text
        redoxide: "#9A3324", // red-oxide roof paint — primary accent / CTAs
        shutter: "#2F4A3C", // bottle-green shutters — secondary / dark sections
        veldgold: "#C9A656", // dry grass — highlights, dividers
        healed: "#5C7A52", // veld after rest/rain — success, "healed" state
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ['"Source Sans 3"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
