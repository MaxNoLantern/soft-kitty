<template>
  <v-app>
    <v-app-bar fixed app color="primary" class="white--text">
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
.container {
  height: 100%;
}
</style>

<script>
export default {
  data() {
    return {
      title: 'Soft kitty',
    }
  },
}
</script>
