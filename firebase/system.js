import { getDatabase, get, ref } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import {app, currentAuth} from "./auth.js";
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// stores firebase app & db
class System {
    constructor() {
        this.app = app;
        this.db = getDatabase(this.app);
        this.auth = currentAuth;
    }
    
}

export {System}