import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NoteModel } from '../note.model';
import { NoteService } from '../note-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit, OnDestroy {
  sharable: number;
  allNotes: NoteModel[];
  userNotes: NoteModel[];
  allNotesSubscription: Subscription;
  userNotesSubscription: Subscription;
  error: string = ""
  errorSubscription: Subscription;

  constructor(private activeRoute: ActivatedRoute, private notesService: NoteService,private router: Router) { }

  ngOnInit(): void {
    this.allNotesSubscription = this.notesService.noteInformation.subscribe(notes => {
      this.allNotes = notes
    })
    this.userNotesSubscription = this.notesService.userNoteInformation.subscribe(notes => {
      this.userNotes = notes
    })
    this.errorSubscription = this.notesService.noteError.subscribe(error => {
      this.error = error
    })

    this.activeRoute.params.subscribe(
      (params: Params) => {
        this.sharable = +this.activeRoute.snapshot.queryParams['sharable']
        if (this.sharable === 1) {
          this.notesService.getSharableNotes()
        }
        else {
          this.notesService.getUserNotes()
        }
      }
    )

  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe()
    this.allNotesSubscription.unsubscribe()
    this.userNotesSubscription.unsubscribe()
  }

  onAddNoteClick(): void {
    this.router.navigate(['new'], { relativeTo: this.activeRoute, queryParamsHandling: "preserve" })

  }
}
