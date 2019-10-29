<template>
  <v-row>
    <h4 class="display-4 text-primary mb-2 font-weight-black">Retroo</h4>
    <p class="lead mb-4">Run retrospectives in real-time remotely. But together.</p>
    <div class="row">
      <div class="col col-10 col-sm-6">
        <form v-on:submit.prevent="goTo">
          <div class="input-group input-group-lg mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">#</span>
            </div>
            <input
              v-model="aliasID"
              type="text"
              class="form-control"
              placeholder="Enter board code"
              required
            />
            <div class="input-group-append">
              <button class="btn btn-primary" type="submit">Join</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </v-row>
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
