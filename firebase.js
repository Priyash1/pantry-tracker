// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCECekgUYdV0ZSqCUv7zeEDNTIdtRKYzsg",
  authDomain: "pantry-tracker-68cc3.firebaseapp.com",
  projectId: "pantry-tracker-68cc3",
  storageBucket: "pantry-tracker-68cc3.appspot.com",
  messagingSenderId: "376947876228",
  appId: "1:376947876228:web:ec00e0f50d99235e3bfdd1",
  measurementId: "G-6KYEQMS6T5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore= getFirestore(app);
export {firestore}