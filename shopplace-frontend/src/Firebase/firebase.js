
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdlQhUWah03E036HxcHgwF6ML54BtGEQE",
  authDomain: "shopplace-41632.firebaseapp.com",
  projectId: "shopplace-41632",
  storageBucket: "shopplace-41632.appspot.com",
  messagingSenderId: "809915202974",
  appId: "1:809915202974:web:234d341b5948d8fe3aea8f",
  measurementId: "G-1JQF0B6NCR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
