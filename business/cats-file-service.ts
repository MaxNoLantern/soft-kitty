/**
 * Valide le contenu du fichier csv. Renvoie une erreur si non valide.
 */
export function validateFileContent(fileContent: string) {
  console.log('pouet')
  // Le fichier ne doit pas être vide
  if (!fileContent) {
    return {
      error:
        'Le fichier est vide. Veuillez inclure un fichier contenant des données.',
    }
  }

  const lines = fileContent.split('\n')

  // Le fichier doit contenir plus que la ligne d'entête
  if (lines.length === 1) {
    return { error: "Le fichier doit contenir plus d'une ligne" }
  }

  const matrix = lines.map((line) => line.split(';'))
  const columnsCount = matrix[0].length

  // Le nombre de colonne doit être identique sur toutes les lignes
  for (let i = 1; i < lines.length; ++i) {
    if (matrix[i].length !== columnsCount) {
      return {
        error: `La ligne ${
          i + 1
        } à un nombre de colonne différente que la première ligne (${columnsCount} colonne${
          columnsCount > 1 ? 's' : ''
        })`,
      }
    }
  }

  return { result: matrix }
}
