import { Component, OnInit, OnDestroy } from '@angular/core';
import { NoteModel } from '../note.model';
import { NoteService } from '../note-service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notes-details',
  templateUrl: './notes-details.component.html',
  styleUrls: ['./notes-details.component.css']
})
export class NotesDetailsComponent implements OnInit, OnDestroy {
  note: NoteModel;
  sharable: number;
  sharePreview: string = ""
  editNoteError: string = ""
  editNoteErrorSubscription: Subscription;
  indexInList: number
  paramsSubscription: Subscription;

  constructor(private noteService: NoteService, private activeRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.editNoteErrorSubscription = this.noteService.editNoteError.subscribe(error => {
      this.editNoteError = error
    });

    this.sharable = +this.activeRoute.snapshot.queryParams['sharable'];
    this.paramsSubscription = this.activeRoute.params.subscribe((params: Params) => {
      this.indexInList = params['id']
      this.note = this.noteService.getNoteById(+this.activeRoute.snapshot.params['id'], +this.activeRoute.snapshot.queryParams['sharable'])

      if (+this.note.sharable === 1) {
        this.sharePreview = "UnShare"
      }
      else {
        this.sharePreview = "Share"
      }

    })

  }
  ngOnDestroy(): void {
    this.editNoteErrorSubscription.unsubscribe()
    this.paramsSubscription.unsubscribe();
  }

  onEditClick() {
    this.router.navigate(['edit'], { relativeTo: this.activeRoute, queryParamsHandling: "preserve" })
  }

  onDeleteClick() {
    this.noteService.deleteNote(+this.indexInList, this.note.id)

  }
  onShareClick() {
    this.noteService.editNoteSharability(this.indexInList, this.note.id, (((+this.note.sharable) === 1) ? 0 : 1))
  }

}
