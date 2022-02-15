const colours = require('tailwindcss/colors');

module.exports = {
  content: [
    './resources/**/*.antlers.html',
    './resources/**/*.blade.php',
    './content/**/*.md',
    './src/**/*.ts',
    './src/**/*.tsx',
  ],
  important: false,
  theme: {
    extend: {
      colors: {
        grey: colours.neutral,
        teal: colours.sky,
        maroon: colours.slate,
      },
    },
  },
  plugins: [],
}
