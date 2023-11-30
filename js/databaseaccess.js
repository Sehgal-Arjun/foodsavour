import {System} from "../firebase/system.js";
import {get, ref, set, update, remove} from  "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

class DatabaseAccess {
    constructor() {
        this.system = new System();
    }
    // returns array of product objects in the format:
    /*
    123454354:{date:"2023/11/13", productName:"fakeName"}
    */
    getProductObjects() {
        return new Promise((resolve, reject)=>
        {
            this.system.auth.getUser().then((user)=>{
                get(ref(this.system.db, `users/${user.uid}/pantry`)).then((snapshot)=>{
                    console.log(snapshot.val());
                    resolve(snapshot.val());
                }).catch((error)=>{
                    reject(error);
                })
            }).catch((error)=>{
                reject(error);
            })

        })
    }

    // returns just an array of barcodes
    getProductBarcodes() {
        return new Promise((resolve, reject)=>
        {
            this.system.auth.getUser().then((user)=>{
                get(ref(this.system.db, `users/${user.uid}/pantry`)).then((snapshot)=>{
                    const barcodes = [];
                    snapshot.forEach((doc)=>{
                        barcodes.push(doc.key);
                    })
                    resolve(barcodes);
                }).catch((error)=>{
                    reject(error);
                })
            }).catch((error)=>{
                reject(error);
            })

        })

    }

    // sets a given barcode's product name. returns empty promise cause it still needs to be async :(
    setProductName(barcode, productName) {
        return new Promise((resolve, reject)=>{
            this.system.auth.getUser().then((user)=>{
                update(ref(this.system.db, `users/${user.uid}/pantry/${barcode}`), {'productName':productName}).then(()=>{
                    resolve();
                })
            }).catch((error)=>{reject(error)});
        })
    }

    addBarcode(barcode, date) { // rn does not account for multiple of each object
        return new Promise((resolve, reject)=> {
            this.system.auth.getUser().then((user)=>{
                console.log('user logged in,trying to add barcode now')
                update(ref(this.system.db, `users/${user.uid}/pantry`),
                    {[barcode]:{
                        "date":date,
                        "productName":null
                    }}).then(resolve()).catch((error)=>{console.log(error)});
            }).catch((error)=>{
                reject(error);
            })
        })
    }

    isLoggedIn() {
        this.system.auth.getUser().then((user)=>{
            if(user) {
                return true;
            } else {
                return false;
            }
        }).catch((error)=>{
            return false;
        })
    }
    
    deleteBarcode(barcode) {
        console.log(`attempting to delete barcode ${barcode}`)
        return new Promise((resolve, reject)=> {
            this.system.auth.getUser().then((user)=>{
                remove(ref(this.system.db, `users/${user.uid}/pantry/${barcode}`)).then(()=>{resolve()}).catch((error)=>{console.log(error);reject(error)});
            }).catch((error)=>{
                reject(error);
            })
        })
    }


}

export {DatabaseAccess}