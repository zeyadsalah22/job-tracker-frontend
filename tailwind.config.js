/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7571F9",
        secondry: "#F1F1F9",
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'sans-serif'],
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        breathe: "breathe 4s ease-in-out infinite",
        wave: "wave 0.8s ease-in-out 3s 1 forwards",
        "wave-continuous": "waveContinuous 3s ease-in-out infinite",
        "fade-in-wave": "fadeInWave 1s ease-in-out 3s 1 forwards",
        "speech-bubble": "speechBubble 1.2s ease-out 3s 1 forwards",
        "speech-bubble-full": "speechBubbleFull 6s ease-out 3s 1 forwards",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
          },
          "50%": {
            transform: "translateY(-20px) rotate(180deg)",
          },
        },
        breathe: {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.02)",
          },
        },
        wave: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "25%": {
            transform: "rotate(2deg) translateX(1px)",
          },
          "50%": {
            transform: "rotate(-1deg) translateX(-1px)",
          },
          "75%": {
            transform: "rotate(1deg) translateX(1px)",
          },
          "100%": {
            transform: "rotate(0deg)",
          },
        },
        waveContinuous: {
          "0%, 100%": {
            transform: "rotate(0deg)",
          },
          "25%": {
            transform: "rotate(1deg) translateX(0.5px)",
          },
          "75%": {
            transform: "rotate(-1deg) translateX(-0.5px)",
          },
        },
        fadeInWave: {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        speechBubble: {
          "0%": {
            opacity: "0",
            transform: "scale(0.3) translateY(-20px)",
          },
          "60%": {
            opacity: "1",
            transform: "scale(1.05) translateY(-5px)",
          },
          "80%": {
            transform: "scale(0.95) translateY(2px)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
          },
        },
        speechBubbleFull: {
          "0%": {
            opacity: "0",
            transform: "scale(0.3) translateY(-20px)",
          },
          "10%": {
            opacity: "1",
            transform: "scale(1.05) translateY(-5px)",
          },
          "13%": {
            transform: "scale(0.95) translateY(2px)",
          },
          "16%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
          },
          "85%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
          },
          "100%": {
            opacity: "0",
            transform: "scale(0.9) translateY(-10px)",
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")
  ],
};
