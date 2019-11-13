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
          <h1 class="font-weight-light">{{board.name}}({{id}})</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(column, index) in board.columns" :key="column.id" :id="column.id">
          <h2 class="mb-2">
            {{column.heading}} ({{column.id}})
            <v-chip
              :input-value="'true'"
              outlined
            >{{cards[column.id] && cards[column.id].length || 0}}</v-chip>
          </h2>
          <form v-on:submit.prevent="add(index, column.id)">
            <v-text-field
              v-model="cardInput[index]"
              label="Add new item"
              color="cyan"
              minlength="1"
              :append-icon="'mdi-plus-circle'"
              @click:append="add(index, column.id)"
              outlined
            ></v-text-field>
          </form>
          <draggable
            v-model="cards[column.id]"
            group="cards"
            :animation="150"
            @end="onEnd"
            ghost-class="ghost"
          >
            <transition-group>
              <v-card
                class="mb-2"
                v-for="(card, ind) in sortedCards[column.id]"
                :key="card.id"
                :columnID="column.id"
              >
                <v-card-text>
                  <strong>{{card.rankIndex}} {{card.id}}</strong>
                  {{card.comment}}
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <!-- <v-chip class="ma-2" color="green" text-color="white">
                    <v-avatar left class="green darken-4">{{card.upvote}}</v-avatar>
                    <v-icon>mdi-thumb-up</v-icon>
                  </v-chip>-->
                  <v-btn @click="deleteCard(card.id)" icon>
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
      rankIndex: 0,
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
  computed: {
    sortedCards() {
      return mapObject(this.cards, (val, key) => {
        return sortBy(val, "rankIndex");
      });
    }
  },
  methods: {
    onEnd(evt) {
      const oldColumnRef = evt.from.parentNode.parentNode.id;
      const newColumnRef = evt.to.parentNode.parentNode.id;
      if (oldColumnRef !== newColumnRef || evt.oldIndex !== evt.newIndex) {
        let newRank;
        if (evt.newIndex == 0) {
          newRank = this.cards[newColumnRef][1].rankIndex / 2;
        } else if (evt.newIndex == this.cards[newColumnRef].length - 1) {
          newRank = this.cards[newColumnRef][evt.newIndex - 1].rankIndex + 100;
        } else {
          newRank =
            (this.cards[newColumnRef][evt.newIndex - 1].rankIndex +
              this.cards[newColumnRef][evt.newIndex + 1].rankIndex) /
            2;
        }
        this.$set(this.cards[newColumnRef][evt.newIndex], "rankIndex", newRank);

        db.collection("boards")
          .doc(this.id)
          .collection("cards")
          .doc(this.cards[newColumnRef][evt.newIndex].id)
          .update({
            columnID: newColumnRef,
            rankIndex: newRank
          });
      }
    },
    deleteCard(id) {
      db.collection("boards")
        .doc(this.id)
        .collection("cards")
        .doc(id)
        .delete();
    },
    add(index, columnID) {
      db.collection("boards")
        .doc(this.id)
        .collection("cards")
        .add({
          columnID: columnID,
          comment: this.cardInput[index],
          upvote: 0,
          downvote: 0,
          rankIndex:
            (this.cards[columnID].length &&
              this.cards[columnID].slice(-1).pop().rankIndex + 100) ||
            100
        });
      this.cardInput[index] = "";
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
      this.board.columns.forEach(column => {
        this.$set(this.cards, column.id, []);
      });
    });

    boardRef
      .doc(this.id)
      .collection("cards")
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            this.cards[change.doc.data().columnID].push(
              Object.assign({}, change.doc.data(), {
                id: change.doc.id
              })
            );
          }
          if (change.type === "modified") {
            this.$set(
              this.cards[change.doc.data().columnID],
              findIndex(this.cards[change.doc.data().columnID], {
                id: change.doc.id
              }),
              Object.assign({}, change.doc.data(), {
                id: change.doc.id
              })
            );

            // console.log("modified", change);
          }
          if (change.type === "removed") {
            this.cards[change.doc.data().columnID] = this.cards[
              change.doc.data().columnID
            ].filter(card => {
              return card.id !== change.doc.id;
            });
            // console.log("removed", change);
          }
        });
        // this.cards = doc.data();
      });
  }
};
</script>