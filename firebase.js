// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9V2i6AM10i0DFJYAJBsEjF9bE7ZbO6Uo",
  authDomain: "hspantryapp-74c20.firebaseapp.com",
  projectId: "hspantryapp-74c20",
  storageBucket: "hspantryapp-74c20.appspot.com",
  messagingSenderId: "358027629508",
  appId: "1:358027629508:web:7dfdb9596e54d3b1ee4a91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
const firestore = getFirestore(app)
export {app, firestore}

