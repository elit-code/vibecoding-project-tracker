/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Tweak in M6 (tag-style) and M8 (due-tint)
        feature: '#10B981', // emerald
        bug: '#DC2626',     // crimson
        'due-safe': '#3cddc7',
        'due-warning': '#cfdaf2',
        'due-overdue': '#ffb4ab',
        'due-neutral': '#39494e',
      },
    },
  },
  plugins: [],
};
