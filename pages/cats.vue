<template>
  <div>
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
          <v-dialog v-model="dialog" max-width="50rem">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" class="mb-2" v-bind="attrs" v-on="on">
                Ajouter un chat
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Nom"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-menu
                        v-model="fromDateMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scroll-x-transition"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            label="Né le"
                            prepend-icon="mdi-calendar"
                            readonly
                            :value="
                              moment(editedItem.birthDate).format(dateFormat)
                            "
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          label=""
                          v-model="currentBirthDate"
                          @input="fromDateMenu = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.sex"
                        :items="availlableSexes"
                        label="Sexe"
                        transition="scroll-x-transition"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.race"
                        label="Race"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        type="number"
                        v-model="editedItem.price"
                        label="Prix"
                        append-icon="mdi-currency-eur"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.comments"
                        label="Commentaires"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Annuler
                </v-btn>
                <v-btn color="primary" @click="save"> Sauvegarder </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
  private formTitle = ''
  private fromDateMenu = false

  private availlableSexes = ['Mâle', 'Femelle']

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

  public get currentBirthDate() {
    return moment(this.editedItem.birthDate).format('YYYY-MM-DD')
  }

  public set currentBirthDate(newValue) {
    this.editedItem.birthDate = moment(newValue).unix() * 1000
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

  public moment = moment
}
</script>