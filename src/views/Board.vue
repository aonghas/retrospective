<template>
  <div>
    <div class="mt-4">
      <div class="row justify-content-center">
        <div class="col">
          <div class="row justify-content-center">
            <div class="col-12 col-md-8 text-center" v-if="!found">
              <div class="alert alert-warning" role="alert">
                <h4 class="alert-heading">Uh oh...!</h4>
                <p class="mb-0">
                  We can't find the bill
                  <strong>{{this.aliasID}}</strong>.
                </p>
              </div>
              <router-link class="btn btn-outline-primary" to="/home">Take me back</router-link>
            </div>
            <!-- End of not found section -->

            <div class="col-12 col-md-10">
              <div v-if="found">
                <div class="card bg-light">
                  <div class="card-body">
                    <h1 class="font-weight-light mb-3">
                      {{currentBill.name}}
                      <span
                        class="badge badge-info float-right"
                        @click="share"
                      >{{ aliasID }}</span>
                    </h1>
                    <div class="row">
                      <div class="col-12 col-md-4 mb-3 d-none d-md-block">
                        <div class="card">
                          <div class="card-body">
                            <Participants
                              :currentBill="currentBill"
                              :showBar="showParticipants"
                              @dismiss="showParticipants = false"
                            ></Participants>
                          </div>
                        </div>
                      </div>
                      <div class="col-12 col-md-8">
                        <button
                          class="btn btn-sm btn-outline-primary float-right d-md-none mb-2"
                          @click="showParticipants = true"
                        >Participants</button>

                        <h4 class="mt-0 mb-0">Add item</h4>
                        <form class="formgroup mt-2" v-on:submit.prevent="handleAdd">
                          <div class="input-group input-group">
                            <input
                              type="text"
                              class="form-control"
                              name="itemName"
                              placeholder="Item"
                              aria-describedby="buttonAdd"
                              v-model="item.name"
                              required
                              ref="itemName"
                              style="width: 50%"
                            />
                            <input
                              type="number"
                              step="0.01"
                              class="form-control"
                              name="itemPrice"
                              placeholder="Price"
                              aria-describedby="buttonAdd"
                              v-model="item.price"
                              required
                              ref="itemPrice"
                            />
                            <div class="input-group-append">
                              <button type="submit" class="btn btn-info" id="buttonAdd">+</button>
                            </div>
                          </div>
                        </form>
                        <div class="row mt-3">
                          <h4 class="col mb-0">
                            Bill items
                            <small>
                              <span
                                class="badge badge-info align-text-top"
                              >{{currentBill.items.length}}</span>
                            </small>
                          </h4>
                          <div class="col text-right bottom-align-text">
                            Total:
                            <strong>{{totalPrice | currency('£')}}</strong>
                          </div>
                        </div>

                        <p
                          v-if="!currentBill.items.length"
                          class="text-muted mt-2 mb-0"
                        >Nothing to show yet</p>

                        <div class="list-group mt-2" v-if="currentBill.items.length">
                          <a
                            href="#"
                            class="list-group-item list-group-item-action"
                            v-for="item in currentBill.items.slice().reverse()"
                            v-bind:key="item.id"
                            v-bind:class="{'active' : item.id === activeItem}"
                            @click.prevent="activeItem = item.id"
                          >
                            {{item.name}}
                            <span class="float-right">{{item.price | currency('£') }}</span>
                          </a>
                        </div>
                        <div class="form-check my-2 mr-sm-2">
                          <input
                            v-model="currentBill.serviceCharge"
                            class="form-check-input"
                            type="checkbox"
                            id="serviceCharge"
                            @change="update"
                          />
                          <label
                            class="form-check-label"
                            for="serviceCharge"
                          >Add 12.5% service charge to bill</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- TO-DO sidebar -->
    <!-- <Participants
      :currentBill="currentBill"
      :showBar="showParticipants"
      @dismiss="showParticipants = false"
    ></Participants>-->
  </div>
</template>
<script>
import db from "../db.js";
import Firebase from "firebase";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Participants from "@/views/Participants";
export default {
  name: "Board",
  data() {
    return {
      activeItem: null,
      currentBill: {
        aliasID: "",
        id: null,
        name: "",
        items: [],
        participants: [],
        serviceCharge: false
      },
      showParticipants: false,
      found: true,
      item: {
        name: "",
        price: "",
        id: ""
      }
    };
  },
  props: ["user", "bills"],
  components: {
    FontAwesomeIcon,
    Participants
  },
  created() {
    this.$router
      .replace({
        params: { aliasID: this.$route.params.aliasID.toUpperCase() }
      })
      .catch(err => {});
    this.aliasID = this.$route.params.aliasID.toUpperCase();
  },
  computed: {
    totalPrice() {
      const reducer = (accum, current) => parseFloat(current.price) + accum;
      return (
        this.currentBill.items.reduce(reducer, 0) *
        (this.currentBill.serviceCharge ? 1.125 : 1)
      );
    }
  },
  methods: {
    share() {
      if (navigator.share) {
        navigator
          .share({
            title: "Our Split Bill: " + this.aliasID,
            text: "Check out our split bill for " + this.currentBill.name,
            url: window.location.href
          })
          .then(() => console.log("Successful share"))
          .catch(error => console.log("Error sharing", error));
      } else {
        console.log(window.location.href);
      }
    },
    createNewBill() {
      db.collection("bills")
        .add({
          aliasID: this.aliasID,
          createdAt: Firebase.firestore.FieldValue.serverTimestamp(),
          name: this.currentBill.name,
          items: this.currentBill.items,
          serviceCharge: this.currentBill.serviceCharge
        })
        .then(doc => {
          console.log("created new", doc.id);
          this.currentBill.id = doc.id;
        });
    },
    update(e) {
      console.log("this bill", this.currentBill);
      if (this.currentBill.id) {
        db.collection("bills")
          .doc(this.currentBill.id)
          .update({
            name: this.currentBill.name,
            items: this.currentBill.items,
            serviceCharge: this.currentBill.serviceCharge
          });
      } else if (this.currentBill.name) {
        this.createNewBill();
      }
    },
    handleAdd() {
      this.currentBill.items.push({
        name: this.item.name.trim(),
        price: parseFloat(this.item.price).toFixed(2),
        id: this.generateID(6)
      });
      this.item.name = "";
      this.item.price = "";
      this.$refs.itemName.focus();
      this.update();
    },
    highlightContent(e) {
      console.log(e);
      this[e.target.dataset.ref] = e.target.innerText;
    },
    updateInput(element) {
      this.$emit("input", this.$el.innerText);
    },
    updateView() {
      const found = this.bills.find(el => {
        return el.aliasID == this.$route.params.aliasID;
      });

      if (found) {
        this.currentBill = found;
      } else {
        this.found = false;
      }
    }
  },
  watch: {
    $route: function(id) {
      console.log("change here");
      this.$router
        .push({
          params: { aliasID: this.$route.params.aliasID.toUpperCase() }
        })
        .catch(err => {});
    },
    bills() {
      this.updateView();
    }
  },
  mounted() {
    this.updateView();
  }
};
</script>