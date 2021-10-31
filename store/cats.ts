import moment from 'moment'
import { Store } from 'vuex'
import { Cat } from '~/service/cats.model'
import { computeHeaders, mapRows } from '~/service/cats.service'

//#region Types
/**
 * State du module gérant les chats
 */
export interface CatsState {
  cats: Cat[]
}

type CatsStateFactory = () => CatsState

//#endregion

//#region Module

/**
 * Représentation du module de gestion des chats
 */
export class CatsModule {
  constructor(private $store: Store<CatsState>) {}

  /**
   * Importe les données de chat
   * @param matrix Données à importer
   */
  importCatsFromMatrix(matrix: string[][]) {
    this.$store.dispatch('cats/importCatsFromMatrix', matrix)
  }
}

export const state: CatsStateFactory = () => ({
  cats: [],
})

export const mutations = {
  /**
   * Initialize l'application avec une liste de chat
   * @param state State courant
   * @param cats Chats à ajouter
   */
  intialize(state: CatsState, cats: Cat[]) {
    state.cats = cats
  },
  /**
   * Ajoute un chat à l'application
   * @param state State courant
   * @param cat Chat à ajouter
   */
  add(state: CatsState, cat: Cat) {
    state.cats = [...state.cats, cat]
  },
  /**
   * Met à jour les données d'un chat
   * @param state State courant
   * @param payload Index et données du chat à mettre à jour
   */
  update(state: CatsState, { index, cat }: { index: number; cat: Cat }) {
    if (index >= 0) {
      state.cats = [
        ...state.cats.slice(0, index),
        cat,
        ...state.cats.slice(index + 1),
      ]
    }
  },
  /**
   * Remet à zéro l'état de l'application
   * @param state State courant
   */
  reset(state: CatsState) {
    state.cats = []
  },
  /**
   * Supprime un chat
   * @param state State courant
   * @param cat Chat à supprimer
   */
  delete(state: CatsState, cat: Cat) {
    const index = state.cats.indexOf(cat)
    if (index >= 0) {
      state.cats = [
        ...state.cats.slice(0, index),
        ...state.cats.slice(index + 1),
      ]
    }
  },
}

export const actions = {
  /**
   * Importe les données de chat
   * @param param0
   * @param rawCats
   * @returns
   */
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

    commit('intialize', cats)
  },
}
//#endregion
