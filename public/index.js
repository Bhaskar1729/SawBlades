import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js"
import { getFirestore, getDocs, collection, addDoc, doc, orderBy, query, limit } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

const firebaseConfig = {
    apiKey: my_api_key,
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

let citiesCol = await query(collection(db, "Cities"), orderBy("Area", "desc"), limit(10));


export async function addToLeaderboard(name, score) {
    await addDoc(collection(db, "Cities"), {
        Name: name,
        Area: score
    });
}

export async function getLeaderboardItems() {
    const querySnapshot = await getDocs(citiesCol);
    const arr = [];
    for (let i = 0; i< querySnapshot.size; i++) {
        let person = {"name": "lol", "score": 0};
        person["name"] = querySnapshot.docs[i].data()["Name"];
        person["score"] = querySnapshot.docs[i].data()["Area"];
        console.log(person["name"], person["score"]);
        arr.push(person);
    }
    return arr;
}

