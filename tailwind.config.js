/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          glow: 'hsl(var(--primary-glow))',
          light: 'hsl(var(--primary-light))',
          dark: 'hsl(var(--primary-dark))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-card': 'var(--gradient-card)'
      },
      boxShadow: {
        'glow': 'var(--shadow-glow)',
        'custom': 'var(--shadow-lg)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
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
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
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
