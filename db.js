import firebase from 'firebase';

 // Your web app's Firebase configuration
 const firebaseConfig = {
  apiKey: "AIzaSyBJmOxy7ZRI8-c6d1VRNCNKE_-Wk5MuH2k",
  authDomain: "vue-wordwheel.firebaseapp.com",
  databaseURL: "https://vue-wordwheel.firebaseio.com",
  projectId: "vue-wordwheel",
  storageBucket: "",
  messagingSenderId: "490755602547",
  appId: "1:490755602547:web:304e4015c5f64d87405206"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();