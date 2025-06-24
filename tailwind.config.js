const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  content: [  
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/pages/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,

        background: {
          DEFAULT: "#111111",
          200: "#666666",
          300: "#595959",
          400: "#4d4d4d",
          500: "#404040",
          600: "#333333",
          700: "#262626",
          800: "#1a1a1a",
          900: "#1C1C1C",
        },
        primary: {
          DEFAULT: "#000000",
          200: "#666666",
          300: "#595959",
          400: "#4d4d4d",
          500: "#404040",
          600: "#333333",
          700: "#262626",
          800: "#1a1a1a",
          900: "#1C1C1C",
        },
        typography: {
          DEFAULT: "#FFFFF",
          secondary: colors.stone["400"],
        },
      },
     
    },
  },

  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio")
  ],
};
