import { System } from "../firebase/system.js"
import { DatabaseAccess } from "./databaseaccess.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
class InputIngredients {
    constructor() {
        this.system = new System();
        this.auth = getAuth();
        this.databaseAccess = new DatabaseAccess();
        this.bindInput();
    }
    bindInput() {
        const inputForm = document.getElementById("inputIngredient");
        inputForm.addEventListener('submit', (e)=>this.input(e));
    }
    input(e) {
        e.preventDefault();
        console.log('inputting')
        const barcode = document.getElementById('barcode').value;
        const date = document.getElementById('date').value;
        this.databaseAccess.addBarcode(barcode,date).then(()=>{console.log('done')}).catch((error)=>{console.log(error)});
    }
}

const inputIngredient = new InputIngredients();