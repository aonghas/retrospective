<template>
  <v-container>
    <v-row v-if="!found">
      <v-col class="text-center">
        <div class="alert alert-warning" role="alert">
          <h4 class="headline">Uh oh...!</h4>
          <p class="mb-0">
            We can't find the board
            <strong>{{this.aliasID}}</strong>.
          </p>
        </div>
        <v-btn depressed color="yellow lighten-4" class="mt-3" to="/home">Take me back</v-btn>
      </v-col>
    </v-row>
  </v-container>
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
  props: ["user", "boards"],
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
  computed: {},
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
    createNewBoard() {
      db.collection("boards")
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
        db.collection("boards")
          .doc(this.currentBill.id)
          .update({
            name: this.currentBill.name,
            items: this.currentBill.items,
            serviceCharge: this.currentBill.serviceCharge
          });
      } else if (this.currentBill.name) {
        this.createNewBoard();
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
      const found = this.boards.find(el => {
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