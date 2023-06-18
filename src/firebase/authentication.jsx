import firebase from './firebase.jsx';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';


class Auth {
    #auth;
    // #ref;
    constructor() {
        this.#auth = getAuth(firebase.app);
    }

    get auth() {
        return this.#auth;
    }

    login = ({ email, password }) =>
        signInWithEmailAndPassword(this.#auth, email, password);

    logout = () =>
        signOut(this.#auth);


}

const auth = new Auth();
export default auth;
