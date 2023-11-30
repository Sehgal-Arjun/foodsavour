// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js';
import {getAuth} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcm-lu-rWjGkt7wZrvJ3jy2y0GAfObZF0",
  authDomain: "se101-a786f.firebaseapp.com",
  projectId: "se101-a786f",
  storageBucket: "se101-a786f.appspot.com",
  messagingSenderId: "292065061552",
  appId: "1:292065061552:web:cfdb1e2b7bdb947775a975"
};

const app = initializeApp(firebaseConfig);

class Auth {
  constructor() {
    this.auth = getAuth();
    this.user = null;
    this.auth.onAuthStateChanged((user)=>{
      if(user){
          this.user = user;
          console.log(user)
      }
    })
  }
  
  getUser() {
    return new Promise((resolve, reject)=>{
      if (this.user) {

        resolve(this.user);
      } else {
        this.auth.onAuthStateChanged((user)=>{
          if(user){
            this.user = user;
            resolve(this.user);
          } else {
            reject(new Error('user not logged in'));
          }
        })
      }
    });
  }
}
const currentAuth = new Auth();
// Initialize Firebase
export {app, currentAuth}