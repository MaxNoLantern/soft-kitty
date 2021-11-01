<template>
  <div class="index-wrapper">
    <v-card class="index-content pa-4">
      <h1>Bonjour !</h1>
      <blockquote>
        Pour commencer veuillez ajouter un fichier de données
      </blockquote>

      <v-file-input
        class="mt-6"
        label="Fichier de données"
        accept=".csv"
        :disabled="loading"
        :loading="loading"
        @change="validateFile"
        :error-messages="validationErrors"
      ></v-file-input>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          elevation="2"
          :disabled="!canImport"
          @click="importCats"
          >Importer !</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<style lang="scss">
.index-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { CatsModule } from '~/store/cats'
import { validateFileContent } from '~/service/cats.service'
import { readFile } from '~/utils/file-utils'

/**
 * Page principale, propose l'initialisation de données
 */
@Component
export default class extends Vue {
  //#region Data
  /**
   * Erreur suite à la validation
   */
  private validationErrors: string = ''
  /**
   * Vaut vrai si la validation de données est lancé; sinon faux
   */
  private loading = false
  /**
   * Représentation des données à importer
   */
  private fileContent: string[][] = []
  //#endregion

  //#region Computed
  /**
   * Vaut vrai si on peut importer le fichier; sinon faux
   */
  public get canImport(): boolean {
    return this.loading || (!this.validationErrors && this.fileContent.length)
      ? true
      : false
  }
  //#endregion

  //#region Methods

  /**
   * Import les données des chats dans le systeme
   */
  public importCats() {
    const catsModule = new CatsModule(this.$store)
    catsModule.importCatsFromMatrix(this.fileContent)

    this.$router.push({
      path: '/cats',
    })
  }

  /**
   * Valide que le contenu du fichier est cohérent
   */
  public async validateFile(file: File) {
    try {
      this.loading = true
      const { error, result } = validateFileContent(await readFile(file))
      this.validationErrors = error ?? ''
      this.fileContent = result ?? []
      this.loading = false
    } catch {
      this.validationErrors = ''
    }
  }

  //#endregion

  //#region Lifecycle (terre des lions)

  public mouted() {
    this.$store.commit('cats/reset')
  }
  //#endregion
}
</script>
