import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Конфиг веб-приложения Firebase. Это не секрет: он и так виден в коде сайта,
// доступ к данным защищают правила Firestore и вход по аккаунту.
const firebaseConfig = {
  apiKey: "AIzaSyAQ0_NQvdFh_-0if6bxpU0YdFtpB_iywGU",
  authDomain: "my-mind-91002.firebaseapp.com",
  projectId: "my-mind-91002",
  storageBucket: "my-mind-91002.firebasestorage.app",
  messagingSenderId: "605860121216",
  appId: "1:605860121216:web:dfd6b47a3b2c84dcd33465",
}

export const firebaseReady = !firebaseConfig.apiKey.startsWith("PASTE")

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
