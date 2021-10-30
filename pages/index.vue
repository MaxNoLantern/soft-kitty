<template>
  <div>
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

    <v-btn
      color="primary"
      elevation="2"
      :disabled="!canImport"
      @click="importCats"
      >Importer !</v-btn
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Mutations } from '../store/cats'

@Component
export default class extends Vue {
  private validationErrors: string = ''
  private loading = false
  /**
   * Représentation des données à importer
   */
  private fileContent: string[][] = []

  public get canImport(): boolean {
    return this.loading || (!this.validationErrors && this.fileContent.length)
      ? true
      : false
  }

  public importCats() {}

  /**
   * Valide que le contenu du fichier est cohérent
   */
  private async validateFile(file: File) {
    try {
      this.loading = true
      const { error, result } = this.validateFileContent(
        await this.readFile(file)
      )
      this.validationErrors = error ?? ''
      this.fileContent = result ?? []
      this.loading = false
    } catch {
      this.validationErrors = ''
    }
  }

  /**
   * Lit le contenu d'un fichier
   */
  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.readAsText(file)

      reader.onload = () => {
        resolve(reader.result as string)
      }

      reader.onerror = (error) => {
        reject()
      }
    })
  }

  /**
   * Valide le contenu du fichier csv. Renvoie une erreur si non valide.
   */
  private validateFileContent(fileContent: string) {
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
}
</script>
