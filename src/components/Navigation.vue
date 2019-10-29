<template>
  <div>
    <v-toolbar color="cyan">
      <v-toolbar-title>Retroo</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-toolbar-items>
        <v-btn text to="/boards" v-if="user">Boards</v-btn>
        <v-btn text to="/login" v-if="!user">Login</v-btn>
        <v-btn text @click="$emit('logout')" v-if="user">Logout</v-btn>
        <!-- <v-btn text to="/register" v-if="!user">register</v-btn> -->
      </v-toolbar-items>

      <template v-if="$vuetify.breakpoint.smAndUp">
        <v-btn icon>
          <v-icon>mdi-export-variant</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-delete-circle</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </template>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: "navigation",
  props: ["user"]
};
</script>