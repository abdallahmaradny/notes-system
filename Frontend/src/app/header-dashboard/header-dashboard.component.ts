import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account-info/account-service';

@Component({
  selector: 'app-header-dashboard',
  templateUrl: './header-dashboard.component.html',
  styleUrls: ['./header-dashboard.component.css']
})
export class HeaderDashboardComponent implements OnInit {

  constructor(private accountService:AccountService) { }

  ngOnInit(): void {
  }

  logOutClick(): void {
    this.accountService.logOutAccount()

  }
}
