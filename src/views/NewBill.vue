<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col">
        <div class="row justify-content-center">
          <div class="col-12 col-md-9 col-lg-7">
            <h1 class="font-weight-light mb-3">New bill</h1>
            <form v-on:submit.prevent="createNewBill">
              <h5 class="font-weight-light">What's your bill for?</h5>

              <div class="input-group mb-3">
                <input
                  class="form-control"
                  placeholder="eg. Dinner at Clos Maggiore"
                  v-model="name"
                  required
                  v-on:keydown.enter.stop.prevent="$refs.memberName.focus()"
                />
              </div>
              <h5 class="font-weight-light">Who's involved?</h5>
              <div class="input-group input-group">
                <input
                  type="text"
                  class="form-control"
                  name="memberName"
                  placeholder="Name"
                  aria-describedby="buttonAdd"
                  v-model="participant.name"
                  ref="memberName"
                  v-on:keydown.prevent.enter="addName"
                />
                <div class="input-group-append">
                  <button type="button" class="btn btn-info" id="buttonAdd" @click="addName">+</button>
                </div>
              </div>
              <small id="helpName" class="form-text text-muted">You can also add participants later.</small>

              <ul class="list-group mt-2" v-if="participants.length">
                <li
                  class="list-group-item p-1"
                  v-for="member in participants.slice().reverse()"
                  v-bind:key="member.id"
                >
                  <button
                    class="btn btn-sm btn-outline-secondary mr-2"
                    title="Delete Name"
                    @click.prevent="deleteName(member.id)"
                  >
                    <font-awesome-icon icon="trash"></font-awesome-icon>
                  </button>
                  {{member.name}}
                </li>
              </ul>
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
  name: "NewBill",
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
    addName() {
      this.participant.name = this.participant.name.trim();
      if (this.participant.name) {
        this.participants.push({
          name: this.participant.name,
          id: this.participant.id
        });
        this.clearUser();
      }
    },
    deleteName(id) {
      this.participants = this.participants.filter(item => {
        return item.id !== id;
      });
    },
    createNewBill() {
      db.collection("bills")
        .add({
          aliasID: this.aliasID,
          createdAt: Firebase.firestore.FieldValue.serverTimestamp(),
          name: this.name,
          items: this.items,
          serviceCharge: false,
          participants: this.participants
        })
        .then(doc => {
          console.log("created new", doc.id);
          this.$router
            .push({ name: "bill", params: { aliasID: this.aliasID } })
            .catch(err => {});
        });
    },
    update(e) {
      if (this.id) {
        db.collection("bills")
          .doc(this.id)
          .update({
            name: this.name,
            items: this.items
          });
      } else if (this.name) {
        this.createNewBill();
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