import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AccountModel } from './account.model';
import { AppConfig } from '../AppConfig';
import { CookieService } from 'ngx-cookie-service';
import { TokenModel } from '../token.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AccountService {
    responseToken: TokenModel;
    accountInfo: AccountModel;
    accountError = new Subject<string>();
    userInformation = new Subject<AccountModel>();
    isFetchingRequest = new Subject<boolean>();
    editAccountError = new Subject<string>();
    successfulRegistration = new Subject<boolean>();

    constructor(private http: HttpClient, private appConfig: AppConfig, private cookieService: CookieService, private router: Router) {

    }
    /**
      *  Used to register a new user by sending the form data in the post request.
      *  Incase of success of request a token is retrieved and saes the token in the cookies
      *  Incase an error occured a subject error is set with the error string to be previewed.
      * 
      *  @params accountInfo-->information to register user of type AccountModel
      *  
      * */
    registerUser(accountInfo: AccountModel): void {
        this.http
            .post(
                this.appConfig.REGISTER_ENDPOINT,
                accountInfo, {
                    observe: "response"
                }
            ).subscribe(responseData => {

                this.responseToken = <TokenModel>responseData.body;
                this.cookieService.set('token', this.responseToken.token);
                this.cookieService.set('id', this.responseToken.id);
                this.cookieService.set('iat', this.responseToken.iat);
                this.cookieService.set('exp', this.responseToken.exp);
                this.accountError.next("")
                this.successfulRegistration.next(true);

            }, (error => {
                this.accountError.next(error.error.error)
                this.successfulRegistration.next(false);

            }));

    }
    /**
      *  Used to login an existing user by sending the credentials in the post request.
      *  Incase of success of request a token is retrieved and saes the token in the cookies
      *  and the user is routed to the his dashboard.
      *  Incase an error occured a subject error is set with the error string to be previewed.
      * 
      *  @params accountCredentials-->email and password
      *  
      * */
    loginUser(accountCredentials: AccountModel): void {
        this.http
            .post(
                this.appConfig.LOGIN_ENDPOINT,
                accountCredentials, {
                    observe: "response"
                }
            )
            .subscribe(responseData => {
                this.responseToken = <TokenModel>responseData.body;
                this.cookieService.set('token', this.responseToken.token);
                this.cookieService.set('id', this.responseToken.id);
                this.cookieService.set('iat', this.responseToken.iat);
                this.cookieService.set('exp', this.responseToken.exp);
                this.accountError.next("")

                this.router.navigate(['/dashboard/account'])


            }, (error => {
                this.accountError.next(error.error.error)

            }));
    }
    /**
      *  Used to get user information
      *  Incase of success of request the retrieved data is set in an information subject.
      *  The request sent has the authorization header(token) retrieved from the cookies.
      *  Incase an error occured a subject error is set with the error string to be previewed.
      * 
      * */
    getUserInformation(): void {
        this.isFetchingRequest.next(true);
        const headers = new HttpHeaders().set("authorization", "JWT " + this.cookieService.get('token'));

        this.http.get<AccountModel>(
            this.appConfig.GET_USER_INFO_ENDPOINT.replace('$', this.cookieService.get('id')),
            { headers }
        ).subscribe(responseData => {
            this.userInformation.next(responseData);
            this.isFetchingRequest.next(false);
            this.accountError.next("")


        }, error => {
            this.accountError.next(error.error.error)
            this.isFetchingRequest.next(false);
        })

    }
    /**
      *  Used to edit user information
      *  Incase of success of request the retrieved data is set in an information subject
      *  then the user is routed to his account section.
      *  The request sent has the authorization header(token) retrieved from the cookies.
      *  Incase an error occured a subject error is set with the error string to be previewed.
      *  @params accountInfo-->editted user info of type AccountModel
      * 
      * */
    editUserInformation(accountInfo: AccountModel): void {
        this.isFetchingRequest.next(true);

        const headers = new HttpHeaders().set("authorization", "JWT " + this.cookieService.get('token'));
        this.http
            .put(
                this.appConfig.EDIT_USER_INFO_ENDPOINT.replace('$', this.cookieService.get('id')),
                accountInfo, { headers }
            ).subscribe(responseData => {
                this.userInformation.next(<AccountModel>responseData)
                this.editAccountError.next("")
                this.router.navigate(['/dashboard/account'])
                this.isFetchingRequest.next(false);


            }, (error => {
                this.editAccountError.next(error.error.error)
                this.isFetchingRequest.next(false);

            }));

    }
    /**
      *  Used to delete a user
      *  Incase of success of request the cookies are cleared and the user is routed to the registration page/
      *  The request sent has the authorization header(token) retrieved from the cookies.
      *  Incase an error occured a subject error is set with the error string to be previewed.
      *  @params accountInfo-->editted user info of type AccountModel
      * 
      * */
    deleteAccount(): void {
        this.isFetchingRequest.next(true);

        const headers = new HttpHeaders().set("authorization", "JWT " + this.cookieService.get('token'));
        this.http
            .delete(
                this.appConfig.DELETE_USER_ENDPOINT.replace('$', this.cookieService.get('id')),
                { headers }
            ).subscribe(responseData => {
                this.editAccountError.next("")
                this.router.navigate([''])
                this.isFetchingRequest.next(false);
                this.cookieService.deleteAll('/')


            }, (error => {
                this.editAccountError.next(error.error.error)
                this.isFetchingRequest.next(false);

            }));


    }
      /**
      *  Used to logout a user by deleting the cookies and routing to the login page
      * */  
    logOutAccount(): void {
        this.cookieService.deleteAll('/')
        this.router.navigate(['/login'])


    }
}