#!/bin/bash
# Apply Soft UI Evolution classes
sed -i '' -E 's/\brounded-lg\b/rounded-soft/g' src/App.jsx
sed -i '' -E 's/\brounded\b/rounded-soft/g' src/App.jsx
sed -i '' -E 's/\bshadow-xl\b/shadow-soft-hover/g' src/App.jsx
sed -i '' -E 's/\bshadow-sm\b/shadow-soft/g' src/App.jsx
sed -i '' -E 's/\bshadow-md\b/shadow-soft-hover/g' src/App.jsx
sed -i '' -E 's/\bshadow\b/shadow-soft/g' src/App.jsx
sed -i '' -E 's/transition-colors/transition-all duration-250/g' src/App.jsx

# Fix text-white on neutral due dates
sed -i '' "s/dueDateState === 'neutral' ? '#ffffff' : '#101415'/'#101415'/g" src/App.jsx

# Fix Add Task button
sed -i '' 's/bg-blue-600 hover:bg-blue-700 text-white font-semibold/bg-accent hover:opacity-80 text-slate-900 font-bold/g' src/App.jsx

# Fix Modal Save button
sed -i '' "s/px-4 py-2 text-white rounded-soft font-medium transition-all duration-250 \${isFeature ? 'bg-feature hover:bg-emerald-600' : 'bg-bug hover:bg-red-700'/px-4 py-2 text-slate-900 rounded-soft font-bold transition-all duration-250 \${isFeature ? 'bg-feature hover:opacity-80' : 'bg-bug hover:opacity-80'/g" src/App.jsx

# Delete the old DESIGN.md
rm soft-ui-evolution-DESIGN.md

echo "Done"
