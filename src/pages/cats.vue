<template>
  <div>
    <v-dialog v-model="dialog" max-width="50rem">
      <lazy-cat-form
        :show="dialog"
        :editedItem="editedItem"
        :date-format="dateFormat"
        @save="save"
        @cancel="close"
        @close="close"
      />
    </v-dialog>
    <v-data-table
      :headers="headers"
      :items="cats"
      :items-per-page="15"
      :search="search"
      class="elevation-3"
    >
      <template v-slot:top>
        <v-toolbar flat class="pt-4">
          <v-text-field v-model="search" label="Rechercher"></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="mb-2" @click="dialog = true">
            Ajouter un chat
          </v-btn>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Etes vous sur de supprimer ce fabuleux chat ?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Annuler</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.price`]="{ item }">
        {{ renderPrice(item.price) }}
      </template>
      <template v-slot:[`item.birthDate`]="{ item }">
        {{ renderDate(item.birthDate) }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Cat, defaultItem } from '~/service/cats.model'

@Component
export default class extends Vue {
  //#region Data
  /**
   * Entête de colonne de la liste
   */
  private headers = [
    { text: 'Nom', value: 'name' },
    { text: 'Sexe', value: 'sex' },
    { text: 'Né le', value: 'birthDate' },
    { text: 'Race', value: 'race' },
    { text: 'Prix (€)', value: 'price' },
    { text: 'Commentaires', value: 'comments' },
    { text: 'Actions', value: 'actions', sortable: false },
  ]
  /**
   * Format de date utilisé dans l'écran
   */
  private dateFormat = 'DD/MM/YYYY'

  /**
   * Champ de recherche
   */
  private search = ''
  /**
   * Index de la ligne édité. Vaut -1 si nouvelle ligne.
   */
  private editedIndex = -1
  /**
   * Valeur de la ligne à éditer
   */
  private editedItem: Cat = { ...defaultItem }

  /**
   * Vaut vrai si la dialogue contenant le formaulaire d'ajout/modification de chat doit être affiché; sinon faux
   */
  private dialog = false
  /**
   * Vaut vrai si la dialogue de confirmation de suppression doit s'afficher; sinon faux
   */
  private dialogDelete = false

  //#endregion

  //#region Computed
  /**
   * Liste des chats de l'application
   */
  public get cats() {
    return this.$store.state.cats.cats
  }
  //#endregion

  //#region Method

  /**
   * Rendu de la date
   */
  public renderDate(value: number): string {
    return moment(value).format(this.dateFormat)
  }

  public renderPrice(value: number): string {
    let price = value.toString()

    const parts = price.split('.')
    if (!parts[1] || parts[1].length === 0) {
      parts.push('00')
    } else if (parts[1].length === 1) {
      parts[1] += '0'
    }

    return parts.join(',')
  }

  /**
   * Edition d'un chat
   */
  public editItem(item: Cat) {
    this.editedIndex = this.cats.indexOf(item)
    this.editedItem = {
      ...item,
    }
    this.dialog = true
  }

  /**
   * Commence le processus de suppression d'un chat
   */
  public deleteItem(item: Cat) {
    this.editedItem = item
    this.dialogDelete = true
  }

  /**
   * Confirmation de la supression
   */
  public deleteItemConfirm() {
    this.$store.commit('cats/delete', this.editedItem)
    this.closeDelete()
  }

  /**
   * Fermeture de la dialogue d'édition
   */
  public close() {
    this.dialog = false
    this.$nextTick(() => {
      this.editedItem = { ...defaultItem }
      this.editedIndex = -1
    })
  }

  /**
   * Fermeture de la dialogue de suppression
   */
  public closeDelete() {
    this.dialogDelete = false
    this.$nextTick(() => {
      this.editedItem = { ...defaultItem }
      this.editedIndex = -1
    })
  }

  /**
   * Sauvegarde du chat en édition
   */
  public save() {
    if (this.editedIndex > -1) {
      this.$store.commit('cats/update', {
        index: this.editedIndex,
        cat: this.editedItem,
      })
    } else {
      this.$store.commit('cats/add', this.editedItem)
    }
    this.close()
  }
  //#endregion
}
</script>