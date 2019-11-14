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
    <div v-if="found">
      <v-row>
        <v-col>
          <h1 class="font-weight-light">{{board.name}} ({{id}})</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(column, colIndex) in board.columns" :key="column.id" :id="column.id">
          <h2 class="mb-2">
            {{column.heading}} ({{column.id}})
            <v-chip :input-value="'true'" outlined>{{column.cards.length}}</v-chip>
          </h2>
          <form v-on:submit.prevent="add(colIndex, column.id)">
            <v-text-field
              v-model="cardInput[colIndex]"
              label="Add new item"
              color="cyan"
              minlength="1"
              required
              :append-icon="'mdi-plus-circle'"
              @click:append="add(colIndex, column.id)"
              outlined
            ></v-text-field>
          </form>
          <draggable
            v-model="column.cards"
            group="cards"
            :animation="150"
            @end="onEnd"
            ghost-class="ghost"
          >
            <transition-group appear name="slide-fade" mode="out-in">
              <v-card
                class="mb-2 card"
                v-for="(card, cardIndex) in column.cards"
                :key="card.id"
                :columnID="column.id"
              >
                <v-card-text>{{card.comment}}</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <!-- <v-chip class="ma-2" color="green" text-color="white">
                    <v-avatar left class="green darken-4">{{card.upvote}}</v-avatar>
                    <v-icon>mdi-thumb-up</v-icon>
                  </v-chip>-->
                  <v-btn @click="deleteCard(colIndex, cardIndex)" icon>
                    <v-icon color="red lighten-3">mdi-delete</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </transition-group>
          </draggable>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script>
import db from "../db.js";
import Firebase from "firebase";
import draggable from "vuedraggable";
import { findIndex, sortBy, mapObject } from "underscore";

export default {
  name: "Board",
  data() {
    return {
      cardInput: {},
      id: null,
      cards: {},
      board: {
        columns: [],
        id: null,
        name: ""
      },
      found: true
    };
  },
  props: ["user"],
  components: {
    draggable
  },
  created() {
    this.$router
      .replace({
        params: { id: this.$route.params.id.toUpperCase() }
      })
      .catch(err => {});
    this.id = this.$route.params.id.toUpperCase();
  },
  computed: {},
  methods: {
    onEnd(evt) {
      this.updateDB();
    },
    deleteCard(colIndex, cardIndex) {
      this.board.columns[colIndex].cards.splice(cardIndex, 1);
      this.updateDB();
    },
    updateDB() {
      db.collection("boards")
        .doc(this.id)
        .update({
          columns: this.board.columns
        });
    },
    add(colIndex) {
      if (this.cardInput[colIndex].length) {
        this.board.columns[colIndex].cards.push({
          comment: this.cardInput[colIndex],
          upvote: 0,
          downvote: 0,
          id: this.generateID(6)
        });

        this.updateDB();
      }
      this.cardInput[colIndex] = "";
    }
  },
  watch: {
    $route: function(id) {
      this.$router
        .push({
          params: { id: this.$route.params.id.toUpperCase() }
        })
        .catch(err => {});
    }
  },
  mounted() {
    const boardRef = db.collection("boards");
    boardRef.doc(this.id).onSnapshot(doc => {
      this.board = doc.data();
      // this.board.columns.forEach(column => {
      //   this.$set(this.cards, column.id, []);
      // });
    });

    boardRef
      .doc(this.id)
      .collection("cards")
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          this.board = change.doc.data();
          // if (change.type === "added") {
          //   this.board = change.doc.data()
          // }
          // if (change.type === "modified") {
          //   this.$set(
          //     this.cards[change.doc.data().columnID],
          //     findIndex(this.cards[change.doc.data().columnID], {
          //       id: change.doc.id
          //     }),
          //     Object.assign({}, change.doc.data(), {
          //       id: change.doc.id
          //     })
          //   );

          //   // console.log("modified", change);
          // }
          // if (change.type === "removed") {
          //   this.cards[change.doc.data().columnID] = this.cards[
          //     change.doc.data().columnID
          //   ].filter(card => {
          //     return card.id !== change.doc.id;
          //   });
          //   // console.log("removed", change);
          // }
        });
        // this.cards = doc.data();
      });
  }
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease !important;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1) !important;
}
.slide-fade-enter
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-fade-leave-to {
  background: red;
  transform: translateX(20px);
  opacity: 0;
}
.card {
  position: relative;
  top: 0;
  left: 0;
  transition: top 0.2s ease, left 0.25s ease;
  cursor: move;
}

.card:hover {
  top: -2px;
  left: -1px;
}
</style>