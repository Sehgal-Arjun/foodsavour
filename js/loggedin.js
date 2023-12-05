// FIREBASE PART
import {get, ref} from  "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import {System} from "../firebase/system.js";
import { DatabaseAccess } from "./databaseaccess.js";

class checkLoggedIn{
    constructor(){
        this.system = new System();
        this.DatabaseAccess = new DatabaseAccess();

        this.system.auth.getUser().then((user)=>{
            if (user.email == undefined || user.email.length == 0){
                document.getElementById("loginheadertext").innerHTML = "Log In";
                document.getElementById("loginheadertext").href = "login.html";
            }
            else{
                document.getElementById("loginheadertext").innerHTML = "Logged In";
                document.getElementById("loginbuttontext").innerHTML = "View Recipes";
                document.getElementById("loginheadertext").href = "";
                document.getElementById("loginbuttontext").href = "recipies.html";
            }
        }).catch((error)=>{
            return false;
        })
    }
}

const loggedin = new checkLoggedIn();