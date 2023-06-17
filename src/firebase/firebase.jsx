import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

class Firebase {
  #apiKey = "AIzaSyD2-7ilOqvT2ik5kGB8BhQxXUC3zD21c-Q";
  #authDomain = "planificador-de-horarios.firebaseapp.com";
  #databaseURL = "https://planificador-de-horarios-default-rtdb.firebaseio.com";
  #projectId = "planificador-de-horarios";
  #storageBucket = "planificador-de-horarios.appspot.com";
  #messagingSenderId = "828904751559";
  #appId = "1:828904751559:web:b56b0e5b4af70b228a99e2";
  #measurementId = "G-SGSQ6LFH63";

  #firebaseConfig;
  #app;
  #analytics;

  constructor() {
    this.#firebaseConfig = {
      apiKey: this.#apiKey,
      authDomain: this.#authDomain,
      databaseURL: this.#databaseURL,
      projectId: this.#projectId,
      storageBucket: this.#storageBucket,
      messagingSenderId: this.#messagingSenderId,
      appId: this.#appId,
      measurementId: this.#measurementId,
    };
  }

  initApp() {
    this.#app = initializeApp(this.#firebaseConfig);
    this.#analytics = getAnalytics(this.#app);
  }

  get app() {
    return this.#app;
  }

  get analytics() {
    return this.#analytics;
  }
}

const firebase = new Firebase();
firebase.initApp();

export default firebase;
