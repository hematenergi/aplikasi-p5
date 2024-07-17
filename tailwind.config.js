/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: ({ colors }) => {
        return {
          mainColor: "#045CEE",
          redColor: "#B40609",
          link: "#FE3A30",
        }
      },
      blur: {
        background: "150px",
        backgroundExtra: "160px",
      },
    },
  },
  plugins: [],
}
