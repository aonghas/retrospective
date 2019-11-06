<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="font-weight-light">Your boards</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2 class="font-weight-light">Your active boards</h2>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!activeBoards.length && !loading">You have no active boards.</v-col>
      <v-col>
        <v-card
          class="d-inline-block ma-2"
          v-for="item in activeBoards"
          :key="item.id"
          width="270"
          height="180"
          outlined
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div
                class="overline mb-2"
              >Created {{item.created && item.created.seconds | humanizeDate }}</div>
              <v-list-item-title class="headline mb-1">{{item.name}}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip>{{item.id}}</v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-btn color="primary" :to="'/boards/' + item.id" text>View board</v-btn>
            <v-btn color="error" @click="disable(item.id)" text>Archive</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2 class="font-weight-light">Your disabled boards</h2>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!disabledBoards.length && !loading">You have no disabled boards.</v-col>
      <v-col>
        <v-card
          class="d-inline-block ma-2"
          v-for="item in disabledBoards"
          :key="item.id"
          width="270"
          height="180"
          outlined
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div
                class="overline mb-2"
              >Expires {{item.deactivatedDate && item.deactivatedDate.seconds | timeout }}</div>
              <v-list-item-title class="headline mb-1">{{item.name}}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip>{{item.id}}</v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-btn color="error" @click="activate(item.id)" text>Reactivate</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import moment from "moment";

import Firebase from "firebase";
import db from "../db.js";

export default {
  name: "Boards",
  data() {
    return {
      loading: true,
      editMode: false,
      meetingName: null,
      boards: []
    };
  },
  computed: {
    editText() {
      return !this.editMode ? "Edit" : "Done";
    },
    activeBoards() {
      return this.boards.filter(board => board.active);
    },
    disabledBoards() {
      return this.boards.filter(board => !board.active);
    }
  },
  filters: {
    totalPrice(value) {
      const reducer = (accum, current) => parseFloat(current.price) + accum;
      return value.reduce(reducer, 0);
    },
    humanizeDate(date) {
      return moment(date * 1000).fromNow();
    },
    timeout(date) {
      if (date) {
        return moment(date * 1000)
          .add(15, "days")
          .fromNow();
      }
    }
  },
  mounted() {
    db.collection("boards").onSnapshot(snapshot => {
      const snapData = [];
      snapshot.forEach(doc => {
        snapData.push({
          id: doc.id,
          aliasID: doc.data().aliasID,
          name: doc.data().name,
          created: doc.data().createdAt,
          items: doc.data().items,
          active: doc.data().active,
          deactivatedDate: doc.data().deactivatedDate
        });
      });
      this.boards = snapData;
      this.loading = false;
    });
  },
  methods: {
    disable(id) {
      db.collection("boards")
        .doc(id)
        .update({
          deactivatedDate: Firebase.firestore.FieldValue.serverTimestamp(),
          active: false
        });
    },
    activate(id) {
      db.collection("boards")
        .doc(id)
        .update({
          active: true,
          deactivatedDate: null
        });
    }
  },
  props: ["user"],
  components: {
    FontAwesomeIcon
  }
};
</script>