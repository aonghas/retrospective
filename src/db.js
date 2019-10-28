import firebase from "firebase";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOpq_68RCo59q80Iq9VQAbxgUXZif9id8",
  authDomain: "hax-billsplit.firebaseapp.com",
  databaseURL: "https://hax-billsplit.firebaseio.com",
  projectId: "hax-billsplit",
  storageBucket: "hax-billsplit.appspot.com",
  messagingSenderId: "99214696065",
  appId: "1:99214696065:web:dbe684dbdb60935220b780",
  measurementId: "G-4V6MNV83Q9"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();
