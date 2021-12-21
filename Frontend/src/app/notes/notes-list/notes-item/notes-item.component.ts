import { Component, OnInit, Input } from '@angular/core';
import { NoteService } from '../../note-service';
import { NoteModel } from '../../note.model';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-notes-item',
  templateUrl: './notes-item.component.html',
  styleUrls: ['./notes-item.component.css']
})
export class NotesItemComponent implements OnInit {
@Input('id') id:number;
  note:NoteModel;
  constructor(private noteService:NoteService,private activeRoute:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.note=this.noteService.getNoteById(this.id, +this.activeRoute.snapshot.queryParams['sharable'])
  }

  onClick(){
        this.router.navigate([this.id],{relativeTo: this.activeRoute ,queryParamsHandling:"preserve"})
  }

}
