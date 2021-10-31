import moment from 'moment'
import { Cat, Headers } from './cats.model'

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

const charToDelete = /["']/g

export function computeHeaders(firstRow: string[]) {
  const headers: Headers = []

  // Nettoyage des noms de colonnes
  const columnNames = firstRow.map((key) =>
    key.replace(charToDelete, '').toLowerCase().trim()
  )

  // Mapping des noms de colonne avec les clés de l'objet Cat
  for (const columnName of columnNames) {
    columnsMapping.forEach((value, key) => {
      if (columnName === key) {
        headers.push(value)
      }
    })
  }

  return headers
}

export function mapRows(headers: Headers, rows: string[][]) {
  return rows.map<Cat>(
    (rawCat) =>
      Object.fromEntries(
        headers.map((key, index) =>
          mapField(key, rawCat[index].replace(charToDelete, ''))
        )
      ) as any
  )
}

function mapField(key: keyof Cat, value: string): [keyof Cat, unknown] {
  return [key, specialMapping[key] ? specialMapping[key](value) : value]
}

const columnsMapping: Map<string, keyof Cat> = new Map([
  ['nom', 'name'],
  ['sexe', 'sex'],
  ['né le', 'birthDate'],
  ['race', 'race'],
  ['prix', 'price'],
  ['commentaires', 'comments'],
])

const specialMapping: {
  [key: string]: (value: string) => unknown
} = {
  birthDate: (value) => moment(value).unix() * 1000,
  price: (value) => parseFloat(value),
}
