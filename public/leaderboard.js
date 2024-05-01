// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmVdHkNgeCcFjjcijerCPZEEySCn1q7ZA",
  authDomain: "sawblades-f9106.firebaseapp.com",
  projectId: "sawblades-f9106",
  storageBucket: "sawblades-f9106.appspot.com",
  messagingSenderId: "815820681728",
  appId: "1:815820681728:web:f365f7b5d6f5bcbe351ee5",
  measurementId: "G-KLXENKYCDM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getCities() {
    const CitiesCol = db.getCities();
    const CitiesSnapshot = await getDocs(CitiesCol);
    const citiesList = CitiesSnapshot.docs.map(doc => doc.data());
    return citiesList;
}

const array = getCities();

console.log(citiesList);