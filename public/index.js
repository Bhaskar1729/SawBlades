import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js"
import { getFirestore, getDocs, collection, addDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

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
let firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

const citiesCol = collection(db, "Cities");

const querySnapshot = await getDocs(citiesCol);

console.log(querySnapshot.size);

querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
});


export async function addToLeaderboard(name, score) {
    await addDoc(citiesCol, {
        Name: name,
        Area: score
    });

}

