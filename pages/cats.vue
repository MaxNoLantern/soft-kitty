<template>
  <div>
    <lazy-cat-form
      :show="dialog"
      :editedItem="editedItem"
      :date-format="dateFormat"
      @save="save"
      @cancel="close"
      @close="close"
    />
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
      <template v-slot:item.birthDate="{ item }">
        {{ renderDate(item.birthDate) }}
      </template>
      <template v-slot:item.actions="{ item }">
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
import { Cat } from '~/store/cats'

@Component
export default class extends Vue {
  private headers = [
    { text: 'Nom', value: 'name' },
    { text: 'Sexe', value: 'sex' },
    { text: 'Né le', value: 'birthDate' },
    { text: 'Race', value: 'race' },
    { text: 'Prix (€)', value: 'price' },
    { text: 'Commentaires', value: 'comments' },
    { text: 'Actions', value: 'actions', sortable: false },
  ]
  private dateFormat = 'DD/MM/YYYY'
  private search = ''
  private editedIndex = -1
  private dialog = false
  private dialogDelete = false

  private defaultItem: Cat = {
    name: '',
    sex: '',
    birthDate: moment().unix() * 1000,
    race: '',
    price: 0,
    comments: '',
  }
  private editedItem: Cat = { ...this.defaultItem }

  public get cats() {
    return this.$store.state.cats.cats
  }

  public renderDate(value: number): string {
    return moment(value).format(this.dateFormat)
  }

  public editItem(item: Cat) {
    this.editedIndex = this.cats.indexOf(item)
    this.editedItem = {
      ...item,
    }
    this.dialog = true
  }

  public deleteItem(item: Cat) {
    this.editedItem = item
    this.dialogDelete = true
  }

  public deleteItemConfirm() {
    this.$store.commit('cats/delete', this.editedItem)
    this.closeDelete()
  }

  public close() {
    this.dialog = false
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    })
  }

  public closeDelete() {
    this.dialogDelete = false
    this.$nextTick(() => {
      this.editedItem = { ...this.defaultItem }
      this.editedIndex = -1
    })
  }

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
}
</script>