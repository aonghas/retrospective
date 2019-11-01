<template>
  <v-app>
    <Navigation :user="user" @logout="logout" />

    <v-content>
      <router-view
        v-if="!loading"
        class="container"
        :user="user"
        :boards="boards"
        :error="error"
        @logout="logout"
        @addMeeting="addMeeting"
        @deleteBoard="deleteBoard"
      />
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Firebase from "firebase";
import db from "./db.js";

export default {
  name: "App",
  components: {
    Navigation,
    Footer
  },
  data: () => ({
    loading: true,
    user: null,
    boards: [],
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
    deleteBoard(payload) {
      db.collection("boards")
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
    }
  },
  mounted() {
    Firebase.auth().onAuthStateChanged(user => {
      if (true) {
        this.user = user;
        this.loading = false;

        // db.collection("boards").onSnapshot(snapshot => {
        //   const snapData = [];
        //   snapshot.forEach(doc => {
        //     snapData.push({
        //       id: doc.id,
        //       aliasID: doc.data().aliasID,
        //       name: doc.data().name,
        //       created: doc.data().createdAt,
        //       items: doc.data().items
        //     });
        //   });
        //   this.boards = snapData.sort((a, b) => {
        //     if (
        //       a.name &&
        //       b.name &&
        //       a.name.toLowerCase() < b.name.toLowerCase()
        //     ) {
        //       return -1;
        //     } else {
        //       return 1;
        //     }
        //   });
        // });
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
