import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "1rem",
        md: ".5rem",
        sm: ".25rem",
      },
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
          border: "hsl(var(--card-border) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
          border: "hsl(var(--popover-border) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          border: "var(--primary-border)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          border: "var(--secondary-border)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
          border: "var(--muted-border)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          border: "var(--accent-border)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
          border: "var(--destructive-border)",
        },
        chart: {
          "1": "hsl(var(--chart-1) / <alpha-value>)",
          "2": "hsl(var(--chart-2) / <alpha-value>)",
          "3": "hsl(var(--chart-3) / <alpha-value>)",
          "4": "hsl(var(--chart-4) / <alpha-value>)",
          "5": "hsl(var(--chart-5) / <alpha-value>)",
        },
        sidebar: {
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
          DEFAULT: "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
        },
        "sidebar-primary": {
          DEFAULT: "hsl(var(--sidebar-primary) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          border: "var(--sidebar-primary-border)",
        },
        "sidebar-accent": {
          DEFAULT: "hsl(var(--sidebar-accent) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "var(--sidebar-accent-border)"
        },
        neon: {
          purple: "hsl(var(--neon-purple) / <alpha-value>)",
          cyan: "hsl(var(--neon-cyan) / <alpha-value>)",
        },
        status: {
          alive: "hsl(var(--status-alive) / <alpha-value>)",
          dead: "hsl(var(--status-dead) / <alpha-value>)",
          online: "rgb(34 197 94)",
          away: "rgb(245 158 11)",
          busy: "rgb(239 68 68)",
          offline: "rgb(156 163 175)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        orbitron: ["Orbitron", "sans-serif"],
        jetbrains: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "flicker": {
          "0%": { opacity: "1" },
          "50%": { opacity: "0.2" },
          "100%": { opacity: "1" },
        },
        "shake": {
          "0%": { transform: "translate(1px, 1px) rotate(0deg)" },
          "25%": { transform: "translate(-2px, 0px) rotate(-1deg)" },
          "50%": { transform: "translate(3px, 2px) rotate(1deg)" },
          "75%": { transform: "translate(-1px, -1px) rotate(0deg)" },
          "100%": { transform: "translate(1px, 2px) rotate(1deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 10px hsl(var(--neon-purple) / 0.4), inset 0 0 5px hsl(0 0% 100% / 0.1)"
          },
          "50%": { 
            boxShadow: "0 0 20px hsl(var(--neon-purple) / 0.6), inset 0 0 8px hsl(0 0% 100% / 0.15)"
          },
        },
        "emf-scan": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "flicker": "flicker 0.25s alternate 4",
        "shake": "shake 0.5s ease",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "emf-scan": "emf-scan 2s linear infinite",
      },
      boxShadow: {
        "neon-purple": "0 0 10px hsl(var(--neon-purple) / 0.4), inset 0 0 5px hsl(0 0% 100% / 0.1)",
        "neon-purple-hover": "0 0 15px hsl(var(--neon-purple) / 0.6), 0 0 8px hsl(var(--neon-cyan) / 0.4)",
        "neon-cyan": "0 0 10px hsl(var(--neon-cyan) / 0.5)",
        "neon-cyan-lg": "0 0 60px hsl(var(--neon-cyan) / 0.75)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
