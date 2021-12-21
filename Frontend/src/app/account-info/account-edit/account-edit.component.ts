import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AccountService } from 'src/app/account-info/account-service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm: NgForm
  error: string = "";
  errorSubscribtion: Subscription;
  isFetchingSubscription: Subscription;
  isFetching: boolean = false;
  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.isFetchingSubscription = this.accountService.editAccountError.subscribe(errorMessage => {
      this.error = errorMessage
    })
    this.errorSubscribtion = this.accountService.editAccountError.subscribe(errorMessage => {
      this.error = errorMessage;
    })

  }
  ngOnDestroy(): void {
    this.isFetchingSubscription.unsubscribe()
    this.errorSubscribtion.unsubscribe()
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      this.accountService.editUserInformation(this.editForm.value)
    }
  }

  deactivateAccount(): void {
    this.accountService.deleteAccount();

  }




}
