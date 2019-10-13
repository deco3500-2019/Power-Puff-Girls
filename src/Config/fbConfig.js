import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth'; //might not be necessary

// Your web app's Firebase configuration (from firebase)
var firebaseConfig = {
    apiKey: "AIzaSyCakcTfyzFAeYJQ-mBXWpS6rDLu51XzGH8",
    authDomain: "food-waste-9896a.firebaseapp.com",
    databaseURL: "https://food-waste-9896a.firebaseio.com/",
    projectId: "food-waste-9896a",
    storageBucket: "food-waste-9896a.appspot.com",
    messagingSenderId: "774565352576",
    appId: "1:774565352576:web:b49f9190c401c465f6c265"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.firestore().setting({ timestampsInSnapShots: true }) //Might not be necssary

export default firebase; 