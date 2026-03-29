import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            h1: { color: '#111827', fontWeight: '800' },
            h2: { color: '#111827', fontWeight: '700', marginTop: '2em', marginBottom: '0.75em' },
            h3: { color: '#111827', fontWeight: '600' },
            p: { lineHeight: '1.8', marginBottom: '1.25em' },
            'ul > li': { marginBottom: '0.5em' },
            'ol > li': { marginBottom: '0.5em' },
            strong: { color: '#111827' },
            a: { color: '#059669', textDecoration: 'underline' },
            table: { fontSize: '0.9em' },
            thead: { backgroundColor: '#f9fafb' },
            'thead th': { color: '#374151', fontWeight: '600' },
            blockquote: {
              borderLeftColor: '#059669',
              backgroundColor: '#f0fdf4',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontStyle: 'normal',
              color: '#065f46',
            },
            hr: { borderColor: '#e5e7eb' },
            code: {
              backgroundColor: '#f3f4f6',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
