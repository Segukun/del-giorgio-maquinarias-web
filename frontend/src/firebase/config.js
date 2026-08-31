// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWM9qpwLrWCTGviCDNJ_bKzwdPKNo3MTI",
  authDomain: "del-giorgio-maquinarias.firebaseapp.com",
  projectId: "del-giorgio-maquinarias",
  storageBucket: "del-giorgio-maquinarias.firebasestorage.app",
  messagingSenderId: "817110352810",
  appId: "1:817110352810:web:33213318ae858bc09321d3",
  measurementId: "G-ZXKQRR7LF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);