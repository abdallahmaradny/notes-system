import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from '../account-info/account-service';
import { Subscription } from 'rxjs';
import { AccountModel } from '../account-info/account.model';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit, OnDestroy {
  accountInformationSubscription: Subscription;
  accountInformation: AccountModel = { userName: "", fullName: "", email: "", password: "" };
  isFetchingSubscription: Subscription;
  isFetching: boolean = true;
  error: string = "";
  errorSubscription: Subscription;




  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.errorSubscription = this.accountService.accountError.subscribe(errorMessage => {
      this.error = errorMessage;
    })
    this.isFetchingSubscription = this.accountService.isFetchingRequest.subscribe(isFetching => {
      this.isFetching = isFetching;
    })
    this.accountService.getUserInformation();
    this.accountInformationSubscription = this.accountService.userInformation.subscribe(userInformation => {
      this.accountInformation = userInformation;
    })
  }

  ngOnDestroy(): void {
    this.accountInformationSubscription.unsubscribe();
    this.isFetchingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();

  }

}
