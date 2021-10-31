<template>
  <v-data-table
    :headers="headers"
    :items="cats"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item.birthDate="{ item }">
      {{ renderDate(item.birthDate) }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import moment from 'moment'
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class extends Vue {
  private headers = [
    {
      text: 'Nom',
      value: 'name',
    },
    { text: 'Sexe', value: 'sex' },
    { text: 'Né le', value: 'birthDate' },
    { text: 'Race', value: 'race' },
    { text: 'Prix (€)', value: 'price' },
    { text: 'Commentaires', value: 'comments' },
  ]
  private dateFormat = 'DD/MM/YYYY'

  public get cats() {
    return this.$store.state.cats.cats
  }

  public renderDate(value: number): string {
    return moment(value).format(this.dateFormat)
  }
}
</script>