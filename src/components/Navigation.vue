<template>
  <div>
    <v-toolbar color="cyan lighten-2">
      <v-toolbar-title>
        <router-link to="/" class="toolbar-title">Retroo</router-link>
      </v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-toolbar-items v-if="$vuetify.breakpoint.smAndUp">
        <v-btn text to="/">Home</v-btn>
        <v-btn text to="/boards">Boards</v-btn>
        <v-btn icon to="/boards/new">
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
        <v-btn text to="/login" v-if="!user">Login</v-btn>
        <v-btn text @click="$emit('logout')" v-if="user">Logout</v-btn>
        <!-- <v-btn text to="/register" v-if="!user">register</v-btn> -->
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: "navigation",
  props: ["user"]
};
</script>

<style scoped>
a.toolbar-title {
  color: white;
  font-weight: 900;
  text-decoration: none;
  font-size: 1.5em;
}
</style>