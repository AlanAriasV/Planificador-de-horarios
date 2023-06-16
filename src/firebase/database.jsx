import firebase from "./firebase.jsx";
import { getDatabase, ref } from "firebase/database";

// console.log(firebase.app);

class Database {
  #database;
  #ref;
  constructor() {
    this.#database = getDatabase(firebase.app);
  }

  get database() {
    return this.#database;
  }

  set refDatabase(path) {
    if (path === undefined) {
      this.#ref = ref(this.#database);
    } else {
      this.#ref = ref(this.#database, path);
    }
  }

  get refDatabase() {
    return this.#ref;
  }
}

const database = new Database();
// database.refDatabase({path: ''});
export default database;
