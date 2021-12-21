import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NoteService } from '../../note-service';
import { ActivatedRoute, Params } from '@angular/router';
import { NoteModel } from '../../note.model';

@Component({
  selector: 'app-notes-edit',
  templateUrl: './notes-edit.component.html',
  styleUrls: ['./notes-edit.component.css']
})
export class NotesEditComponent implements OnInit, OnDestroy {
  @ViewChild('editNoteForm') editNoteForm: NgForm
  error: string = ""
  note: NoteModel
  indexingId: number;
  constructor(private noteService: NoteService, private activeRoute: ActivatedRoute) {
    this.noteService.editNoteError.subscribe(error => {
      this.error = error
    })
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.note = this.noteService.getNoteById(+params['id'], +this.activeRoute.snapshot.queryParams['sharable'])
      this.indexingId = +params['id']
    })
    this.noteService.editNoteError.subscribe(error => {
      this.error = error
    })
  }
  ngOnDestroy(): void {

  }

  onSubmit(): void {
    this.note.description = this.editNoteForm.value.description
    this.note.title = this.editNoteForm.value.title
    this.noteService.editNote(this.indexingId,this.note.id, this.note)
  }

}
