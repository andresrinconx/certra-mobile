// Pallete
const pallete = [
  { // orange
    hex: '#f97316', 
    rbga: (opacity: number) => `rgba(251, 146, 60, ${opacity})`
  },
  { // dark gray
    hex: '#334155', 
    rbga: (opacity: number) => `rgba(30, 41, 59, ${opacity})`,
  },
  { // purple
    hex: '#7c3aed', 
    rbga: (opacity: number) => `rgba(167, 139, 250, ${opacity})`,
  },
  { // green
    hex: '#009950', 
    rbga: (opacity: number) => `rgba(0, 179, 89, ${opacity})`,
  },
  { // teal
    hex: '#14b8a6',
    rbga: (opacity: number) => `rgba(45, 212, 191, ${opacity})`
  },
  { // red
    hex: '#dc2626',
    rbga: (opacity: number) => `rgba(248, 113, 113, ${opacity})`
  },
]
export const themeColors = {...pallete[0]}

// Styles
export const tailwind = {
  // texts
  h1: '',
  h2: '',
  h3: '',
  h4: '',
  h5: '',
  h6: '',
}