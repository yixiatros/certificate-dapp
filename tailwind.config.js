/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1020px",
      xl: "1440px",
    },

    extend: {
      colors: {
        primary: {
          DEFAULT: "#0B1F3A",
          hover: "#12345A",
        },

        secondary: "#315A85",

        accent: {
          DEFAULT: "#4DA3FF",
          hover: "#70B8FF",
        },

        background: "#030A16",

        surface: {
          DEFAULT: "#081426",
          elevated: "#0D1D32",
        },

        border: "#1B3049",

        text: {
          DEFAULT: "#F1F6FC",
          secondary: "#A9B9CC",
          muted: "#6F8197",
        },

        success: "#35D399",
        warning: "#FBBF5A",
        error: "#FF6B6B",
        info: "#45C7E8",

        lightBlue: "hsl(215.02, 98.39%, 51.18%)",
        darkBlue: "hsl(213.86, 58.82%, 46.67%)",
        lightGreen: "hsl(156.62, 73.33%, 58.82%)",
      },

      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        heading: ["Rubik", "sans-serif"],
        mono: ["ui-monospace", "Consolas", "monospace"],
      },

      spacing: {
        180: "32rem",
      },

      boxShadow: {
        DEFAULT:
          "rgba(0, 0, 0, 0.4) 0 10px 15px -3px, rgba(0, 0, 0, 0.25) 0 4px 6px -2px",
      },
    },
  },

  plugins: [
    function ({ addBase, theme }) {
      addBase({
        ":root": {
          // Colors
          "--text": theme("colors.text.DEFAULT"),
          "--text-h": theme("colors.text.DEFAULT"),
          "--bg": theme("colors.background"),
          "--border": theme("colors.border"),
          "--code-bg": theme("colors.surface.DEFAULT"),
          "--accent": theme("colors.accent.DEFAULT"),

          "--accent-bg":
            "color-mix(in srgb, var(--accent) 10%, transparent)",

          "--accent-border":
            "color-mix(in srgb, var(--accent) 50%, transparent)",

          "--social-bg":
            "color-mix(in srgb, var(--surface) 50%, transparent)",

          "--shadow": theme("boxShadow.DEFAULT"),

          // Fonts
          "--sans": Array.isArray(theme("fontFamily.sans"))
          ? theme("fontFamily.sans").join(", ")
          : theme("fontFamily.sans"),

        "--heading": Array.isArray(theme("fontFamily.heading"))
          ? theme("fontFamily.heading").join(", ")
          : theme("fontFamily.heading"),

        "--mono": Array.isArray(theme("fontFamily.mono"))
          ? theme("fontFamily.mono").join(", ")
          : theme("fontFamily.mono"),

        },
      });
    },
  ],
};
