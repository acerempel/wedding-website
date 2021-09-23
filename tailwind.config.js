const colours = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: {
    content: [
      './resources/**/*.antlers.html',
      './resources/**/*.blade.php',
      './content/**/*.md'
    ]
  },
  important: false,
  theme: {
    colors: {
      grey: colours.trueGray,
      teal: colours.teal,
    },
    extend: {},
  },
  variants: {},
  plugins: [],
}
