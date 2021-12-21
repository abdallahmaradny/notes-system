import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NoteService } from '../note-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-note-new',
  templateUrl: './note-new.component.html',
  styleUrls: ['./note-new.component.css']
})
export class NoteNewComponent implements OnInit {
  @ViewChild('newNoteForm') newNoteForm: NgForm
  newNoteError: string = ""
  selectedFile:File
  note = new FormData()
  constructor(private noteService: NoteService,private router:Router,private activeRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.noteService.successfulRequest.subscribe(success=>{
      if(success===true){
        this.router.navigate(['../'], {relativeTo:this.activeRoute,queryParamsHandling:"preserve" })

      }
    })
  }

  onSubmit() {
     
    this.note.append('title',this.newNoteForm.value.title)
    this.note.append('description',this.newNoteForm.value.description)
    this.noteService.createNewNote(this.note)


  }
  onSelectFile(event):void{
    this.selectedFile=<File>event.target.files[0]
    this.note.append('image',this.selectedFile,this.selectedFile.name)
 
  }
}
