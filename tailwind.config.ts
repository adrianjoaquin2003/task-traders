import type { Config } from "tailwindcss";

/* =========================================================================
   TAILWIND CSS CONFIGURATION
   =========================================================================
   
   This file extends Tailwind CSS with:
   - Custom color tokens from CSS variables (defined in index.css)
   - Design system extensions (gradients, shadows, animations)
   - Container settings for responsive layouts
   
   IMPORTANT: All colors use HSL format and reference CSS custom properties
   from index.css. Never add direct color values here.
   ========================================================================= */

export default {
	/* Enable class-based dark mode (add .dark to html/body) */
	darkMode: ["class"],
	
	/* File patterns to scan for Tailwind classes */
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	
	/* No prefix for utility classes */
	prefix: "",
	
	theme: {
		/* ===== RESPONSIVE CONTAINER SETTINGS ===== */
		container: {
			center: true,                    /* Center containers horizontally */
			padding: '2rem',                 /* Default padding on all sides */
			screens: {
				'2xl': '1400px'              /* Max width for 2xl breakpoint */
			}
		},
		extend: {
			/* ===== SEMANTIC COLOR SYSTEM ===== 
			   All colors reference CSS custom properties from index.css.
			   This enables automatic light/dark theme switching.
			   
			   Usage: bg-primary, text-foreground, border-border, etc.
			*/
			colors: {
				/* Base UI colors */
				border: 'hsl(var(--border))',               /* Border color for inputs, cards */
				input: 'hsl(var(--input))',                 /* Input field styling */
				ring: 'hsl(var(--ring))',                   /* Focus ring color */
				background: 'hsl(var(--background))',       /* Page background */
				foreground: 'hsl(var(--foreground))',       /* Main text color */
				/* Brand colors */
				primary: {
					DEFAULT: 'hsl(var(--primary))',         /* Main brand color */
					foreground: 'hsl(var(--primary-foreground))', /* Text on primary */
					glow: 'hsl(var(--primary-glow))'        /* Lighter primary variant */
				},
				
				/* Secondary colors */
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',       /* Secondary background */
					foreground: 'hsl(var(--secondary-foreground))' /* Text on secondary */
				},
				
				/* Error/danger colors */
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',     /* Error/danger background */
					foreground: 'hsl(var(--destructive-foreground))' /* Text on error */
				},
				
				/* Subtle/muted colors */
				muted: {
					DEFAULT: 'hsl(var(--muted))',           /* Muted background */
					foreground: 'hsl(var(--muted-foreground))' /* Muted text */
				},
				
				/* Accent/highlight colors */
				accent: {
					DEFAULT: 'hsl(var(--accent))',          /* Accent background */
					foreground: 'hsl(var(--accent-foreground))' /* Text on accent */
				},
				
				/* Success state colors */
				success: {
					DEFAULT: 'hsl(var(--success))',         /* Success background */
					foreground: 'hsl(var(--success-foreground))' /* Text on success */
				},
				/* Component-specific colors */
				popover: {
					DEFAULT: 'hsl(var(--popover))',         /* Dropdown/popover background */
					foreground: 'hsl(var(--popover-foreground))' /* Popover text */
				},
				card: {
					DEFAULT: 'hsl(var(--card))',            /* Card background */
					foreground: 'hsl(var(--card-foreground))' /* Card text */
				},
				/* Sidebar component colors */
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',      /* Sidebar background */
					foreground: 'hsl(var(--sidebar-foreground))',   /* Sidebar text */
					primary: 'hsl(var(--sidebar-primary))',         /* Active sidebar item */
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))', /* Active text */
					accent: 'hsl(var(--sidebar-accent))',           /* Hover sidebar item */
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))', /* Hover text */
					border: 'hsl(var(--sidebar-border))',           /* Sidebar borders */
					ring: 'hsl(var(--sidebar-ring))'                /* Sidebar focus ring */
				}
			},
			/* ===== DESIGN EFFECTS ===== */
			
			/* Custom gradient backgrounds from CSS variables */
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',  /* Primary brand gradient */
				'gradient-hero': 'var(--gradient-hero)',         /* Hero section gradient */
				'gradient-page': 'var(--gradient-page)'          /* Full page background gradient */
			},
			
			/* Custom shadow effects */
			boxShadow: {
				'elegant': 'var(--shadow-elegant)'              /* Elegant shadow with primary color */
			},
			
			/* Custom transition timing functions */
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)'            /* Smooth cubic-bezier transition */
			},
			/* ===== BORDER RADIUS SYSTEM ===== */
			borderRadius: {
				lg: 'var(--radius)',                    /* Large radius (0.5rem) */
				md: 'calc(var(--radius) - 2px)',       /* Medium radius (6px) */
				sm: 'calc(var(--radius) - 4px)'        /* Small radius (4px) */
			},
			/* ===== CUSTOM ANIMATIONS ===== */
			
			/* Animation keyframes for UI components */
			keyframes: {
				/* Accordion expand animation (Radix UI) */
				'accordion-down': {
					from: {
						height: '0'                                    /* Start collapsed */
					},
					to: {
						height: 'var(--radix-accordion-content-height)' /* Expand to content height */
					}
				},
				/* Accordion collapse animation (Radix UI) */
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)' /* Start at content height */
					},
					to: {
						height: '0'                                    /* Collapse to zero */
					}
				}
			},
			
			/* Animation utilities - use with animate-accordion-down class */
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',     /* Smooth expand */
				'accordion-up': 'accordion-up 0.2s ease-out'          /* Smooth collapse */
			}
		}
	},
	
	/* ===== PLUGINS ===== */
	plugins: [
		require("tailwindcss-animate"),  /* Adds animation utilities and keyframes */
	],
} satisfies Config;
