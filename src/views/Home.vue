<template>
  <v-container>
    <v-row>
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
              v-model="aliasID"
              label="Enter Board ID"
              placeholder="eg. HC15"
              maxlength="4"
              minlength="4"
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
      aliasID: null
    };
  },
  methods: {
    goTo() {
      this.$router
        .push({ name: "board", params: { aliasID: this.aliasID } })
        .catch(err => {});
    }
  }
};
</script>
