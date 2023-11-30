import { System } from "../firebase/system.js"
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
class Login {
    constructor() {
        this.system = new System();
        this.auth = getAuth();
        this.bindLogin();
    }
    bindLogin() {
        const loginForm = document.getElementById("login");
        loginForm.addEventListener('submit', (e)=>this.login(e));
    }
    login(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        signInWithEmailAndPassword(this.auth, email, password).then((userCredential)=>{
            this.system.user = userCredential.user;
            window.location.href = 'https://sehgal-arjun.github.io/foodsavour/productsapi.html';
            console.log('suuccess');
        }).catch((error)=> {
            console.log(error);
        })
    }
}

new Login();