import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AccountService } from '../account-info/account-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit,OnDestroy {
  @ViewChild('loginForm') loginForm:NgForm
  error:string="";
  errorSubscribtion:Subscription;
  constructor(private accountService:AccountService,private router:Router) { }

  ngOnInit(): void {
    this.errorSubscribtion=this.accountService.accountError.subscribe(errorMessage=>{
            this.error=errorMessage;
    })
  }
  ngOnDestroy():void{
  this.errorSubscribtion.unsubscribe()
  }

  onSubmit(){
    console.log(this.loginForm)
    if(this.loginForm.valid){
      this.accountService.loginUser(this.loginForm.value)
    }
   
  }

  redirectToRegister(){
    this.router.navigate([''])

  }

}
