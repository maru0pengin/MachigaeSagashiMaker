module.exports = {
  purge: ['./src/**/*.vue'],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
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
