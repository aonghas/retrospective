import firebase from "firebase";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgEd3R56j-BOl6dFXu1gjcbqqmVIfRWB4",
  authDomain: "vue-retrospective.firebaseapp.com",
  databaseURL: "https://vue-retrospective.firebaseio.com",
  projectId: "vue-retrospective",
  storageBucket: "vue-retrospective.appspot.com",
  messagingSenderId: "737732518114",
  appId: "1:737732518114:web:2eb9f2c9e7c295033e7ebb",
  measurementId: "G-X90BBJ44KC"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();
