<template>
  <v-app>
    <Navigation :user="user" @logout="logout" />

    <v-content>
      <router-view
        v-if="!loading"
        class="container"
        :user="user"
        :bills="bills"
        :error="error"
        @checkIn="checkIn"
        @logout="logout"
        @addMeeting="addMeeting"
        @deleteBill="deleteBill"
      />
    </v-content>
  </v-app>
</template>

<script>
import Navigation from "@/components/Navigation";
import Firebase from "firebase";
import db from "./db.js";

export default {
  name: "App",
  components: {
    Navigation
  },
  data: () => ({
    loading: true,
    user: null,
    bills: [],
    error: null
  }),
  methods: {
    logout() {
      Firebase.auth()
        .signOut()
        .then(() => {
          this.user = null;
          this.$router.push("login");
        });
    },
    deleteBill(payload) {
      db.collection("bills")
        .doc(payload)
        .delete();
    },
    addMeeting(payload) {
      db.collection("users")
        .doc(this.user.uid)
        .collection("meetings")
        .add({
          name: payload,
          createdAt: Firebase.firestore.FieldValue.serverTimestamp()
        });
    },
    checkIn(payload) {
      db.collection("users")
        .doc(payload.userID)
        .collection("meetings")
        .doc(payload.meetingID)
        .get()
        .then(doc => {
          if (doc.exists) {
            db.collection("users")
              .doc(payload.userID)
              .collection("meetings")
              .doc(payload.meetingID)
              .collection("attendees")
              .add({
                displayName: payload.displayName,
                email: payload.email,
                createdAt: Firebase.firestore.FieldValue.serverTimestamp()
              })
              .then(() =>
                this.$router.push(
                  "/attendees/" + payload.userID + "/" + payload.meetingID
                )
              );
          } else {
            this.error = "Sorry, no such meeting exists";
          }
        });
    }
  },
  mounted() {
    Firebase.auth().onAuthStateChanged(user => {
      if (true) {
        this.user = user;
        this.loading = false;

        db.collection("bills").onSnapshot(snapshot => {
          const snapData = [];
          snapshot.forEach(doc => {
            snapData.push({
              id: doc.id,
              aliasID: doc.data().aliasID,
              name: doc.data().name,
              created: doc.data().createdAt,
              items: doc.data().items,
              serviceCharge: doc.data().serviceCharge,
              participants: doc.data().participants
            });
          });
          this.bills = snapData.sort((a, b) => {
            if (
              a.name &&
              b.name &&
              a.name.toLowerCase() < b.name.toLowerCase()
            ) {
              return -1;
            } else {
              return 1;
            }
          });
        });
      } else {
        this.$router.push("/home");
        this.loading = false;
      }
    });
  }
};
</script>

<style lang="scss">
// $primary: rgb(0, 200, 207);

// @import "node_modules/bootstrap/scss/bootstrap";
</style>
