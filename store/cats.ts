import moment from 'moment'
import { Store } from 'vuex'

//#region Types

export interface Cat {
  name: string
  sex: string
  birthDate: number
  race: string
  price: number
  comments: string
}

export interface CatsState {
  cats: Cat[]
}

type CatsStateFactory = () => CatsState

type Headers = (keyof Cat)[]

//#endregion

//#region Business
const charToDelete = /["']/g

function computeHeaders(firstRow: string[]) {
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

function mapRows(headers: Headers, rows: string[][]) {
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
//#endregion

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

//#region Module

/**
 * Représentation du module de gestion des chats
 */
export class CatsModule {
  constructor(private $store: Store<CatsState>) {}

  importCatsFromMatrix(matrix: string[][]) {
    this.$store.dispatch('cats/importCatsFromMatrix', matrix)
  }
}

export const state: CatsStateFactory = () => ({
  cats: [],
})

interface MutationAddParameters {
  cats: Cat[]
  overwrite?: boolean
}
export const mutations = {
  add(state: CatsState, { cats, overwrite }: MutationAddParameters) {
    state.cats = [...(overwrite ? state.cats : []), ...cats]
  },
  reset(state: CatsState) {
    state.cats = []
  },
}

export const actions = {
  async importCatsFromMatrix(
    { commit }: { commit: (mutation: string, args?: any) => void },
    rawCats: string[][]
  ) {
    if (!rawCats.length) {
      return
    }

    // Définition de l'ordre des colonnes pour le mapping
    const headers = computeHeaders(rawCats.shift() ?? [])

    // Mapping des valeurs
    const cats = mapRows(headers, rawCats)

    const mutationArgs: MutationAddParameters = {
      cats,
      overwrite: true,
    }
    commit('add', mutationArgs)
  },
}
//#endregion
