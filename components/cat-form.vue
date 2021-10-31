<template>
  <v-dialog v-model="showDialog" max-width="50rem">
    <v-card>
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
                    :value="moment(editedItem.birthDate).format(dateFormat)"
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
        <v-btn color="blue darken-1" text @click="$emit('cancel')">
          Annuler
        </v-btn>
        <v-btn color="primary" @click="$emit('save')"> Sauvegarder </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script lang="ts">
import moment from 'moment'
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Cat } from '~/store/cats'

@Component
export default class extends Vue {
  @Prop(Boolean)
  private show!: boolean
  @Prop(Object)
  private editedItem!: Cat
  @Prop(String)
  private dateFormat!: string

  private fromDateMenu = false
  private availlableSexes = ['Mâle', 'Femelle']

  public get currentBirthDate() {
    return moment(this.editedItem.birthDate).format('YYYY-MM-DD')
  }

  public set currentBirthDate(newValue) {
    this.editedItem.birthDate = moment(newValue).unix() * 1000
  }

  public get showDialog() {
    return this.show
  }

  public set showDialog(value) {
    this.$emit('close')
  }

  public moment = moment
}
</script>