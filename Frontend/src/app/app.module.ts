import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutesModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { HeaderDashboardComponent } from './header-dashboard/header-dashboard.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountEditComponent } from './account-info/account-edit/account-edit.component';
import { NotesComponent } from './notes/notes.component';
import { NotesListComponent } from './notes/notes-list/notes-list.component';
import { NotesDetailsComponent } from './notes/notes-details/notes-details.component';
import { NotesItemComponent } from './notes/notes-list/notes-item/notes-item.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotesEditComponent } from './notes/notes-details/notes-edit/notes-edit.component';
import { NoteNewComponent } from './notes/note-new/note-new.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterUserComponent,
    LoginUserComponent,
    HeaderDashboardComponent,
    AccountInfoComponent,
    AccountEditComponent,
    NotesComponent,
    NotesListComponent,
    NotesDetailsComponent,
    NotesItemComponent,
    NotFoundComponent,
    NotesEditComponent,
    NoteNewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutesModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
