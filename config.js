import firebase from 'firebase';
require("@firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyBA_zYaJqJmZlhu-z11lqE2J1G0pg2KEuI",
    authDomain: "environment-b96dc.firebaseapp.com",
    databaseURL: "https://environment-b96dc.firebaseio.com",
    projectId: "environment-b96dc",
    storageBucket: "environment-b96dc.appspot.com",
    messagingSenderId: "432789552676",
    appId: "1:432789552676:web:5fbad96e992d9e171622b1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();