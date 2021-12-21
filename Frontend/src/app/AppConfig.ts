import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})

export class AppConfig{
     //User Control Endpoints 
     REGISTER_ENDPOINT:string="http://localhost:8083/register";
     LOGIN_ENDPOINT:string="http://localhost:8083/login";
     GET_USER_INFO_ENDPOINT:string="http://localhost:8083/user/$";
     EDIT_USER_INFO_ENDPOINT:string="http://localhost:8083/user/$";
     DELETE_USER_ENDPOINT:string="http://localhost:8083/user/$";

    //Note Control Endpoints
    GET_SHARABLE_NOTES_ENDPOINT:string="http://localhost:8083/note/notes/$";
    GET_USER_NOTES_ENDPOINT:string="http://localhost:8083/note/$";
    EDIT_NOTE_ENDPOINT:string="http://localhost:8083/note/:noteId/:userId";
    EDIT_SHARABILITY_ENDPOINT:string="http://localhost:8083/note/:noteId/sharable/:userId";
    DELETE_NOTE_ENDPOINT:string="http://localhost:8083/note/:noteId/:userId";
    CREATE_NEW_NOTE_ENDPOINT:string="http://localhost:8083/note/:userId";

}