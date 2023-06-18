import firebase from './firebase.jsx';
import { getDatabase } from 'firebase/database';


class Database {
  #database;
  constructor() {
    this.#database = getDatabase(firebase.app);
  }

  get database() {
    return this.#database;
  }

}

const database = new Database();
export default database;
export { ref } from 'firebase/database';