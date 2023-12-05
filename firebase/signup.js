import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import {System} from "./system.js";
import {set, ref} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js"

class Signup {
    constructor() {
        this.auth = getAuth();
        this.system = new System();
        this.bindSignup();
    }
    bindSignup() { // adds event listener to signup button
        const registerForm = document.getElementById("register"); // needs to be the id of the form
        registerForm.addEventListener('submit', (e)=>this.signup(e));
    }
    signup(e) {
        e.preventDefault(); // i tihnk this stops the page from refreshing but it doesnt even work
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        createUserWithEmailAndPassword(this.auth, email, password).then((userCredential)=>{
            const user = userCredential.user;

            set(ref(this.system.db, `users/${user.uid}`), {
                email: email,
                pantry: {
                }
            }).then(()=>{
                window.location.assign("/productsapi.html");
            })
            
        }).catch((error)=>{
            console.log(error);
        })
    }
    
}
new Signup();
