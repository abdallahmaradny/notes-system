import { Injectable } from '@angular/core';
import { AppConfig } from '../AppConfig';
import { CookieService } from 'ngx-cookie-service';
import { NoteModel } from './note.model';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NoteService {
    private notes: NoteModel[] = [
    ]
    private userNotes: NoteModel[] = [
    ]
    noteInformation = new Subject<NoteModel[]>();
    userNoteInformation = new Subject<NoteModel[]>();
    noteError = new Subject<string>();
    editNoteError = new Subject<string>();
    isFetchingRequest = new Subject<boolean>();
    successfulRequest = new Subject<boolean>();

    constructor(private http: HttpClient, private appConfig: AppConfig, private cookieService: CookieService, private router: Router) {

    }
    /**
          *  Used to retrieve all sharable notes and sets the returned notes array
          *  with the retrieved data to be previewed by setting the notes subject with the 
          *  retrieved notes.
          *  The request sent has the authorization header(token) retrieved from the cookies.
          *  Incase an error occured a subject error is set with the error string to be previwed.
          *  
          * */
    getSharableNotes(): void {
        this.noteInformation.next(this.notes.slice())
        const headers = this.authorizationHeaderRetriever()
        this.http.get<NoteModel[]>(
            this.appConfig.GET_SHARABLE_NOTES_ENDPOINT.replace('$', this.cookieService.get('id')),
            { headers }
        ).subscribe(responseData => {

            this.notes = responseData
            this.noteInformation.next(this.notes.slice())
            this.noteError.next("")

        }, error => {
            this.noteError.next(error.error.error)

        })

    }
    /**
            * Retrieves the note from either the user notes list or the sharable notes list
            * depending on the sharable state.
            * @params id-->The note id in its list
            * @params sharable-->Condition to check if it is sharable or note
            * 
            * @returns-->Note of type NoteModel
            *  
            * */
    getNoteById(id: number, sharable: number): NoteModel {
        if (sharable === 0) {
            return this.userNotes.slice()[id];

        }
        return this.notes.slice()[id];

    }
    /**
          *  Used to retrieve all user notes and sets the returned user notes array
          *  with the retrieved data to be previewed by setting the user notes subject with the 
          *  retrieved notes.
          *  The request sent has the authorization header(token) retrieved from the cookies.
          *  Incase an error occured a subject error is set with the error string to be previwed.
          *  
          * */
    getUserNotes(): void {
        this.userNoteInformation.next(this.userNotes.slice())
        const headers = this.authorizationHeaderRetriever()
        this.http.get<NoteModel[]>(
            this.appConfig.GET_USER_NOTES_ENDPOINT.replace('$', this.cookieService.get('id')),
            { headers }
        ).subscribe(responseData => {
            this.userNotes = responseData
            this.userNoteInformation.next(this.userNotes.slice())
            this.noteError.next("")

        }, error => {
            this.noteError.next(error.error.error)

        })

    }
    /**
          *  Used to edit a note by sending a pu request to the server holding the edit note information
          *  Incase of success of request a routing to my Notes section occurs
          *  The request sent has the authorization header(token) retrieved from the cookies.
          *  Incase an error occured a subject error is set with the error string to be previwed.
          *  
          * */
    editNote(indexingId: number, id: string, noteInformation: NoteModel): void {
        this.isFetchingRequest.next(true);

        const headers = this.authorizationHeaderRetriever()
        this.http
            .put<NoteModel>(
                (this.appConfig.EDIT_NOTE_ENDPOINT.replace(':noteId', id)).replace(':userId', this.cookieService.get('id')),
                noteInformation, { headers }
            ).subscribe(responseData => {
                this.userNotes[indexingId] = responseData
                this.userNoteInformation.next(this.userNotes.slice())
                this.router.navigate(['/dashboard/myNotes'], { queryParams: [{ sharable: 0 }], queryParamsHandling: "preserve" })


                this.editNoteError.next("")
                this.isFetchingRequest.next(false);

            }, (error => {
                this.editNoteError.next(error.error.error)
                this.isFetchingRequest.next(false);

            }));

    }
    /**
          *  Used to edit the sharability of a note.It builds the authorization header along
          *  with the query params indicating the sharability state desired.
          *  Incase of success of request it updates the user note list and all note list 
          *  then routing to my Notes section occurs
          *  The request sent has the authorization header(token) retrieved from the cookies.
          *  Incase an error occured a subject error is set with the error string to be previewed.
          * 
          *  @params indexingId-->Id in list either the user list or all notes list
          *  @params id-->Note id in the DB
          *  @params sharable-->the sharability state desired
          *  
          * */
    editNoteSharability(indexingId: number, id: string, sharable: number): void {
        const options = {
            headers: this.authorizationHeaderRetriever(),
            params: new HttpParams().set('sharable', sharable.toString())
        }

        this.http
            .put<NoteModel>(
                (this.appConfig.EDIT_SHARABILITY_ENDPOINT.replace(':noteId', id)).replace(':userId', this.cookieService.get('id')),
                {}, options
            ).subscribe(responseData => {
                if (sharable === 1) {
                    this.notes.push(responseData)
                    this.noteInformation.next(this.notes.slice())
                    this.userNotes[indexingId] = responseData
                }
                else {
                    this.userNotes[indexingId] = responseData
                    this.userNoteInformation.next(this.userNotes.slice())
                }
                this.editNoteError.next("")
                this.isFetchingRequest.next(false);
                this.router.navigate(['/dashboard/myNotes'], { queryParams: { sharable: 0 }, queryParamsHandling: "preserve" })


            }, (error => {
                this.editNoteError.next(error.error.error)
                this.isFetchingRequest.next(false);

            }));


    }
    /**
          *  Used to delete a note.
          *  InCase of success of request it removes the note from its list and navigates
          *  to my notes section.
          *  The request sent has the authorization header(token) retrieved from the cookies.
          *  Incase an error occured a subject error is set with the error string to be previewed.
          * 
          *  @params idInList->Id in list either the user list 
          *  @params noteId-->Note id in the DB
          *  
          * */
    deleteNote(idInList: number, noteId: string): void {
        this.isFetchingRequest.next(true);

        const headers = this.authorizationHeaderRetriever()
        this.http
            .delete(
                (this.appConfig.DELETE_NOTE_ENDPOINT.replace(':noteId', noteId)).replace(':userId', this.cookieService.get('id')),
                { headers }
            ).subscribe(responseData => {
                this.userNotes.splice(idInList, 1)
                this.userNoteInformation.next(this.userNotes.slice())
                this.editNoteError.next("")
                this.router.navigate(['/dashboard/myNotes'], { queryParams: [{ sharable: 0 }], queryParamsHandling: "preserve" })
                this.isFetchingRequest.next(false);


            }, (error => {
                this.editNoteError.next(error.error.error)
                this.isFetchingRequest.next(false);

            }));

    }
    /**
          *  Used to add a new note
          *  Incase of success of request it updates the user note list and all note list 
          *  The request sent has the authorization header(token) retrieved from the cookies.
          *  Incase an error occured a subject error is set with the error string to be previewed.
          * 
          *  @params FormData of the note
          *  
          * */    
    createNewNote(note: FormData):void {
        this.isFetchingRequest.next(true);
        this.successfulRequest.next(false)

        const headers = new HttpHeaders().set("authorization", "JWT " + this.cookieService.get('token'));

        this.http
            .post<NoteModel>(
                (this.appConfig.CREATE_NEW_NOTE_ENDPOINT).replace(':userId', this.cookieService.get('id')),
                note, {
                    headers
                }
            ).subscribe(responseData => {
                this.successfulRequest.next(true)
                this.userNotes.push(responseData)
                this.userNoteInformation.next(this.userNotes.slice())
                this.isFetchingRequest.next(true);


            }, (error => {
                this.noteError.next(error.error.error)
                this.isFetchingRequest.next(false);

            }));
    }

    authorizationHeaderRetriever(): HttpHeaders {
        return new HttpHeaders().set("authorization", "JWT " + this.cookieService.get('token'));
    }

}