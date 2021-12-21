import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../account-info/account-service';
import { AccountModel } from '../account-info/account.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit, OnDestroy {
  @ViewChild('registerForm') registerForm: NgForm
  accountInfo: AccountModel = { userName: "", email: "", password: "", fullName: "" }
  error: string = "";
  errorSubscribtion: Subscription;
  successfulRegistrationSubscription:Subscription;
  successfulRegistration:boolean=false
  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.successfulRegistrationSubscription=this.accountService.successfulRegistration.subscribe(successRegistration=>{
         this.successfulRegistration=successRegistration;
         if(this.successfulRegistration){
          this.router.navigate(['/dashboard/account'])
        }
    })
    this.errorSubscribtion = this.accountService.accountError.subscribe(errorMessage => {
      this.error = errorMessage;
    })

  }
  ngOnDestroy(): void {
    this.errorSubscribtion.unsubscribe()
  }

  onSubmit() {
    this.accountInfo = this.registerForm.value;
    if (this.registerForm.valid) {
      this.accountService.registerUser(this.accountInfo)

    }


  }

  redirectToLogin() {
    
    this.router.navigate(['/login'])

  }

}
