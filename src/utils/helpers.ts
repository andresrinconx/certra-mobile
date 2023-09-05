export const firstTwoLetters = (fullName: string) => {
  const palabras = fullName.split(' ')
  let letters = ''
  for (let i = 0; i < 2; i++) {
    letters += palabras[i][0]
  }
  return letters
}

export const formatText = (text: string) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}