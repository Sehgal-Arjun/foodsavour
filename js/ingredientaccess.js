// FIREBASE PART
import {get, ref} from  "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import {System} from "../firebase/system.js";
import { DatabaseAccess } from "./databaseaccess.js";

class IngredientAccess {
    constructor() {
        this.system = new System();
        this.databaseAccess = new DatabaseAccess();
        
        this.databaseAccess.getProductNames().then(async (names)=>{
            console.log(names);
            for(let i in barcodes)
            {
                const currentName = names[i];
                try {
                    console.log(currentProductName);
               } catch(error)
               {
                console.error(`Error processing ingredients ${currentName}:`, error);
               }
            }
        });

    }

    }

   