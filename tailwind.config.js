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
    extend: {
      colors: {
        grey: colours.trueGray,
        teal: colours.teal,
      },
    },
  },
  variants: {},
  plugins: [],
}
