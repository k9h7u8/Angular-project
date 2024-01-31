import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth: AngularFireAuth, private router: Router) { }

  //Login Method
  login(email: string, password: string){
    this.fireauth.signInWithEmailAndPassword(email, password).then(res => {
      localStorage.setItem('token', 'true');
      if(res.user?.emailVerified==true){
        this.router.navigate(['/dashboard']);
      }else{
        this.router.navigate(['/verify-email']);
      }
    }, err => {
      alert(err.message);
      this.router.navigate(['/login']);
    })
  }

  //Register Method
  register(email: string, password: string){
    this.fireauth.createUserWithEmailAndPassword(email, password).then(res => {
      alert('Registration successful');
      this.router.navigate(['/login']);
      this.sendEmailForVerification(res.user);
    }, err =>{
      alert(err.message);
      this.router.navigate(['/register']);
    });
  }

  //Sign Out
  logout(){
    this.fireauth.signOut().then(()=>{
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err =>{
      alert(err.message);
    })
  }

  //Forgot Password
  forgotPassword(email:string){
    this.fireauth.sendPasswordResetEmail(email).then(()=>{
      this.router.navigate(['/verify-email']);
    },err =>{
      alert('Something went wrong');
    })
}

  //Verify Email
  sendEmailForVerification(user : any) {
    user.sendEmailVerification().then((res : any) => {
      this.router.navigate(['/verify-email']);
    }, (err : any) => {
      alert('Something went wrong. Not able to send mail to your email.')
    })
  }

  //Login with Google
  googleSignIn(){
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then((res)=>{
      this.router.navigate(['/dashboard']);
      localStorage.setItem('token', JSON.stringify(res.user?.uid));
    }, err =>{
      alert(err.message);
    })
  }

}
