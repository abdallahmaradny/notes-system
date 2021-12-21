import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterUserComponent } from './register-user/register-user.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { HeaderDashboardComponent } from './header-dashboard/header-dashboard.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { NotesComponent } from './notes/notes.component';
import { AccountEditComponent } from './account-info/account-edit/account-edit.component';
import { NotesDetailsComponent } from './notes/notes-details/notes-details.component';
import { NotesEditComponent } from './notes/notes-details/notes-edit/notes-edit.component';
import { NoteNewComponent } from './notes/note-new/note-new.component';

const appRoutes: Routes = [
    { path: '', redirectTo: "/register", pathMatch: "full" },
    { path: 'register', component: RegisterUserComponent },
    { path: 'login', component: LoginUserComponent },
    { path: 'not-found', component: NotFoundComponent },
    {
        path: 'dashboard', component: HeaderDashboardComponent, children: [
            {
                path: 'account', component: AccountInfoComponent, children: [
                    { path: 'edit', component: AccountEditComponent }
                ]
            },
            {
                path: 'myNotes', component: NotesComponent, children: [
                    {
                        path: 'new', component: NoteNewComponent
                    },
                    { path: ':id', component: NotesDetailsComponent },
                    {
                        path: ':id/edit', component: NotesEditComponent
                    }

                ]
            },
            {
                path: 'allNotes', component: NotesComponent, children:
                    [
                        {
                            path: 'new', component: NoteNewComponent
                        },
                        { path: ':id', component: NotesDetailsComponent },
                        {
                            path: ':id/edit', component: NotesEditComponent
                        }


                    ]
            },



        ]
    },


    //should be last component
    { path: '**', redirectTo: '/not-found', pathMatch: 'full' }
]
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutesModule {

}