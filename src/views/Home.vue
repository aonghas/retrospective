<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col class="text-center">
        <h4 class="display-4 cyan--text mx-auto font-weight-black">Retroo</h4>
        <p class="headline mb-4">
          Run
          <strong>re</strong>trospectives in
          <strong>re</strong>al-time
          <strong>re</strong>motely. But together.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <form v-on:submit.prevent="goTo">
          <v-col cols="12" sm="6" md="3" class="mx-auto">
            <v-text-field
              v-model="id"
              label="Enter Board ID"
              color="cyan"
              class="alias-input"
              placeholder="eg. HC15"
              maxlength="4"
              minlength="4"
              :append-outer-icon="'mdi-arrow-right-bold-circle'"
              @click:append-outer="goTo"
              outlined
            ></v-text-field>
          </v-col>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: "home",
  props: ["user"],
  data() {
    return {
      id: null
    };
  },
  methods: {
    goTo() {
      if (this.id && this.id.length == 4) {
        this.$router
          .push({ name: "board", params: { id: this.id } })
          .catch(err => {});
      }
    }
  }
};
</script>

<style>
.alias-input .v-icon.v-icon {
  font-size: 2em;
}
</style>
