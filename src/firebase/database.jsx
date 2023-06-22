import firebase from './firebase.jsx';
import { getDatabase, ref, set } from 'firebase/database';

class Database {
  #database;
  constructor() {
    this.#database = getDatabase(firebase.app);
  }

  get database() {
    return this.#database;
  }

  write({ path, data }) {
    return set(ref(this.#database, path), data);
  }
}

const database = new Database();

export default database;
export { ref } from 'firebase/database';
