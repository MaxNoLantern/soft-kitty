import moment from 'moment'

/**
 * Représente un chat
 */
export interface Cat {
  name: string
  sex: string
  birthDate: number
  race: string
  price: number
  comments: string
}

/**
 * Valeur lié des colonnes du fichier
 */
export type Headers = (keyof Cat)[]

/**
 * Valeur par défaut d'un chat
 */
export const defaultItem: Cat = {
  name: '',
  sex: '',
  birthDate: moment().unix() * 1000,
  race: '',
  price: 0,
  comments: '',
}
