<template>
  <div class="mt-3">
    <div class="text-secondary text-center">
      <div v-if="user" class="text-center">
        Welcome back
        <span class="font-weight-bold text-primary">{{user.displayName}}</span>
      </div>
    </div>
    <div class="text-center">
      <div class="row justify-content-center">
        <div class="col col-xs-12 col-md-10 col-lg-8 col-xl-7">
          <h4 class="display-4 text-primary mb-2">Split</h4>
          <p class="lead mb-4">
            This simple app allows you to create bills and decide who pays for what.
            <br />
            <br />
            <strong>No mess. No spill.</strong>
          </p>
          <div class="row justify-content-center">
            <div class="col col-10 col-sm-6">
              <form v-on:submit.prevent="goToBill">
                <div class="input-group input-group-lg mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">#</span>
                  </div>
                  <input
                    v-model="aliasID"
                    type="text"
                    class="form-control"
                    placeholder="Enter bill code"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    required
                  />
                  <div class="input-group-append">
                    <button class="btn btn-primary" type="submit">Join</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <!-- <router-link class="btn btn-outline-primary mr-2" to="/register" v-if="!user">Register</router-link> -->
          <router-link class="btn btn-outline-primary mr-2" to="/login" v-if="!user">Log In</router-link>
          <router-link class="btn btn-outline-primary mr-2" to="/bills/new" v-if="user">New bill</router-link>
          <router-link class="btn btn-primary" to="/bills" v-if="user">View bills</router-link>
        </div>
      </div>
    </div>
  </div>
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
    goToBill() {
      this.$router
        .push({ name: "bill", params: { aliasID: this.aliasID } })
        .catch(err => {});
    }
  }
};
</script>
