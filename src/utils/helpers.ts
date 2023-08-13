export const firstTwoLetters = (fullName: string) => {
  const palabras = fullName.split(' ')
  let letters = ''
  for (let i = 0; i < 2; i++) {
    letters += palabras[i][0]
  }
  return letters
}