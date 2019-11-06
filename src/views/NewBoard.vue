<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="font-weight-light">New board</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-form v-on:submit.prevent="createNewBoard" ref="form">
          <h5 class="font-weight-light">Give your board a name</h5>

          <v-text-field
            v-model="name"
            color="cyan"
            class="alias-input"
            placeholder="eg. Team A Sprint 1.5"
            required
            :rules="nameRules"
            :append-outer-icon="'mdi-arrow-right-bold-circle'"
            @click:append-outer="createNewBoard"
            outlined
          ></v-text-field>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import db from "../db.js";
import Firebase from "firebase";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
export default {
  name: "NewBoard",
  data() {
    return {
      valid: true,
      nameRules: [v => !!v || "Name is required"],
      participant: {
        name: "",
        id: null
      },
      columns: [
        { heading: "Went Well", cards: [], id: this.generateID(6) },
        { heading: "Not So Well", cards: [], id: this.generateID(6) },
        { heading: "Actions", cards: [], id: this.generateID(6) }
      ],
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
      if (this.$refs.form.validate()) {
        db.collection("boards")
          .doc(this.aliasID)
          .set({
            createdAt: Firebase.firestore.FieldValue.serverTimestamp(),
            name: this.name,
            columns: this.columns,
            active: true,
            deactivatedDate: null
          })
          .then(doc => {
            console.log("created new", doc);
            this.$router
              .push({ name: "board", params: { id: this.aliasID } })
              .catch(err => {});
          });
      }
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