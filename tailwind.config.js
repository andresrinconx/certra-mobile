/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const themeColors = {
  background: '#F6FAFB',
  charge: '#E4F0F3',
  list: '#D2E6EC',
  lightList: '#EDF5F8',
  turquoise: '#1C819F',
  darkTurquoise: '#006283',
  green: '#92BF1E',
  blue: '#1F377E',
  icon: '#B3B3B3',
  typography: '#666666',
  processBtn: '#808080',
  placeholder: '#999999',
}
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'background': `${themeColors.background}`,
        'charge': `${themeColors.charge}`,
        'list': `${themeColors.list}`,
        'lightList': `${themeColors.lightList}`,
        'turquoise': `${themeColors.turquoise}`,
        'darkTurquoise': `${themeColors.darkTurquoise}`,
        'green': `${themeColors.green}`,
        'blue': `${themeColors.blue}`,
        'icon': `${themeColors.icon}`,
        'typography': `${themeColors.typography}`,
        'processBtn': `${themeColors.processBtn}`,
        'placeholder': `${themeColors.placeholder}`,
      }
    },
  },
  plugins: [],
  themeColors
}
