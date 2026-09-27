import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#07110F",
        surface: "#0E1C19",
        "surface-2": "#152623",
        border: "#22332F",
        "border-bright": "#3A514B",
        primary: "#EAF2EF",
        secondary: "#A9BCB6",
        muted: "#7F948D",
        accent: "#8EDCC2",
        "accent-2": "#9FE6CD",
        coral: "#FF6B4A",
        ink: "#051210"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, #C8F2E2, #7FD3B8)",
        "gradient-soft": "linear-gradient(180deg, #0B1917 0%, #07110F 100%)"
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

