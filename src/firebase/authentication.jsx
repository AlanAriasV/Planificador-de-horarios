
import firebase from './firebase.jsx';
import { getAuth } from 'firebase/auth';


class Auth {
    #auth;
    // #ref;
    constructor() {
        this.#auth = getAuth(firebase.app);
    }

    get auth() {
        return this.#auth;
    }
}

const auth = new Auth();
export default auth;
