<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="ol-12 col-md-9 col-lg-7 font-weight-light">Your boards</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!boards.length">You have no boards.</v-col>
      <v-col v-for="item in boards" :key="item.id">
        <v-card width="250" height="180" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-2">{{item.created.seconds | humanizeDate }}</div>
              <v-list-item-title class="headline mb-1">{{item.name}}</v-list-item-title>
              <v-list-item-subtitle>{{item.items}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <v-btn color="primary" :to="'/boards/' + item.aliasID" text>View board</v-btn>
            <v-btn color="error" text>Delete</v-btn>
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
      editMode: false,
      meetingName: null,
      boards: []
    };
  },
  computed: {
    editText() {
      return !this.editMode ? "Edit" : "Done";
    }
  },
  filters: {
    totalPrice(value) {
      const reducer = (accum, current) => parseFloat(current.price) + accum;
      return value.reduce(reducer, 0);
    },
    humanizeDate(date) {
      return moment(date * 1000).fromNow();
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
          items: doc.data().items
        });
      });
      this.boards = snapData;
    });
  },
  methods: {},
  props: ["user"],
  components: {
    FontAwesomeIcon
  }
};
</script>