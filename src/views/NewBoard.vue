<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col">
        <div class="row justify-content-center">
          <div class="col-12 col-md-9 col-lg-7">
            <h1 class="font-weight-light mb-3">New board</h1>
            <form v-on:submit.prevent="createNewBoard">
              <h5 class="font-weight-light">Give your board a name</h5>

              <div class="input-group mb-3">
                <input
                  class="form-control"
                  placeholder="eg. Superheroes Sprint 3 Retro"
                  v-model="name"
                  required
                />
              </div>

              <button type="submit" class="btn btn-primary float-right mt-2">Next</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import db from "../db.js";
import Firebase from "firebase";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
export default {
  name: "NewBoard",
  data() {
    return {
      participant: {
        name: "",
        id: null
      },
      participants: [],
      id: null,
      aliasID:
        Math.random()
          .toString(36)
          .replace(/([^a-z]+|o|i)/g, "")
          .substr(0, 2)
          .toUpperCase() +
        Math.random()
          .toString()
          .substr(2, 2),
      name: "",
      items: []
    };
  },
  props: ["user"],
  components: {
    FontAwesomeIcon
  },
  methods: {
    clearUser() {
      this.participant.name = "";
      this.participant.id = this.generateID(6);
    },
    createNewBoard() {
      db.collection("boards")
        .add({
          aliasID: this.aliasID,
          createdAt: Firebase.firestore.FieldValue.serverTimestamp(),
          name: this.name,
          items: this.items
        })
        .then(doc => {
          console.log("created new", doc.id);
          this.$router
            .push({ name: "board", params: { aliasID: this.aliasID } })
            .catch(err => {});
        });
    },
    highlightContent(e) {
      console.log(e);
      this[e.target.dataset.ref] = e.target.innerText;
    },
    updateInput(element) {
      this.$emit("input", this.$el.innerText);
    }
  },
  mounted() {
    if (this.user) {
      this.clearUser();
      this.participants.push({
        name: this.user.displayName,
        id: this.participant.id
      });
      this.clearUser();
    }
  }
};
</script>