import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F6F2EA",
        surface: "#FFFDF8",
        "surface-2": "#EFE9DD",
        border: "#E6DECE",
        "border-bright": "#CFC4AE",
        primary: "#1C1810",
        secondary: "#524A3A",
        muted: "#6F6757",
        accent: "#8A6208",
        "accent-2": "#F2C230"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, #F2C230, #D9A514)",
        "gradient-soft": "linear-gradient(180deg, #F1ECE1 0%, #F6F2EA 100%)"
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      }
    }
  },
  plugins: []
}

export default config

