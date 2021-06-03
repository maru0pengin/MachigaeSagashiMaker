module.exports = {
  purge: ['./src/**/*.vue'],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blue: {
          light: '#8ABCE5',
          DEFAULT: '#66ccff',
        },
      },
      zIndex: {
        '-10': '-10',
       }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
