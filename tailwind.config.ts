import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./constants/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "skardu-void": "#080C10",
        "skardu-stone": "#1A1F26",
        "skardu-mist": "#2E3A47",
        "skardu-gold": "#C9A84C",
        "skardu-teal": "#3EADA7",
        "skardu-snow": "#F0EDE8",
        "skardu-ash": "#8C9198"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      fontSize: {
        display: ["clamp(3.5rem, 8vw, 7rem)", { lineHeight: "0.95", letterSpacing: "0" }]
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "200% center" },
          to: { backgroundPosition: "-200% center" }
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        grain: {
          "0%,100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-2%,-3%)" },
          "30%": { transform: "translate(3%,-1%)" },
          "50%": { transform: "translate(-1%,2%)" },
          "70%": { transform: "translate(2%,3%)" },
          "90%": { transform: "translate(-3%,1%)" }
        }
      },
      animation: {
        shimmer: "shimmer 5s linear infinite",
        float: "float 6s ease-in-out infinite",
        grain: "grain 8s steps(10) infinite"
      },
      boxShadow: {
        glow: "0 0 40px rgba(201, 168, 76, 0.24)",
        teal: "0 0 40px rgba(62, 173, 167, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
