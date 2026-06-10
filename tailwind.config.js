/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'soft-blue': '#87CEEB',
        'soft-pink': '#FFB6C1',
        'soft-green': '#90EE90',
        feature: '#90EE90', // Soft Green
        bug: '#FFB6C1',     // Soft Pink
        accent: '#87CEEB',  // Soft Blue
        'due-safe': '#90EE90',
        'due-warning': '#fef08a', 
        'due-overdue': '#FFB6C1', 
        'due-neutral': '#e2e8f0', 
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0,0,0,0.06)',
        'soft-hover': '0 4px 16px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        'soft': '10px',
      },
      transitionDuration: {
        '250': '250ms',
      }
    },
  },
  plugins: [],
};
