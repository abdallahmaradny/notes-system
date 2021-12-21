const noteRepository = require('../repositories/note_repository');
const noteEntity = require('../entities/user');
const accountService = new (require("./account_service.js"));
const userRepository = require('../repositories/user_repository');
const authenticationService = new (require("./authentication_service.js"));
const fs = require('fs');

const {
    ErrorHandler
} = require('../helpers/error')
const imagePath = "/../public/notes/"
class NoteService {

    constructor() {
        this.noteRepository = new noteRepository();
        this.userRepository = new userRepository();
    }

    /**
     *  Adds a new note to a certain user where the user Entity is returned
     *  from the user repository and is used in creating a note Entity in the DB.
     *  The token is send to check for user authority.If authorized the function proceeds and adds the note to DB.
     *  The function then sends the image to be saved in its directory.If no error is returned the
     *  note Entity is editted to add the imagePath of the note image.
     *  Incase the userId doesnt exist a reject promise is returned with error code 400
     *  Incase an error in DB occured a reject promise is returned with errod code 500
     * 
     * @params note information(including title,noteDescription) 
     * @params user id owning the note
     * @params user token
     * @params note Image
     * 
     * @return an entity of the added note in the DB
     * 
     */
    addNewNote(userToken, noteInformation, userId, noteImage) {

        //Convert the input information to json object
        noteInformation = JSON.stringify(noteInformation);
        noteInformation = JSON.parse(noteInformation)
        return new Promise((resolve, reject) => {
            accountService.getAccountInfo(userToken, userId).then((userEntity) => {
                if (userEntity == null)
                    reject(new ErrorHandler(404, "User Doesn't exist"));
                else {
                    var tempNoteInformation = JSON.parse(JSON.stringify(noteInformation));
                    this.noteRepository.saveNewNote(noteInformation, userEntity).then((noteEntity) => {
                        this.saveNoteImageInDirectory(noteImage, userId, noteEntity.id).then((imagePath) => {
                            tempNoteInformation.imagePath = imagePath;
                            this.editNote(userToken, tempNoteInformation, noteEntity.id, userId).then((noteEntity) => {
                                resolve(noteEntity)
                            })
                        })
                    }).catch((error) => {
                        reject(new ErrorHandler(500, error.message));
                    });
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    /**
        *  Used to delete a note.
        *  It sends a request to the authentication service to verify the token.
        *  If the user is authorized the note is deleted else an error is returned.
        *  Incase an error occured in note deletion in DB a reject promise is returned with error code 500.
        *
        * @params note id
        * @params user token
        * @params user id
        *
        * @return confirmation of deletion or error message
        */
    deleteNote(userToken, noteId, userId) {
        return new Promise((resolve, reject) => {
            authenticationService.verifyToken(userToken, userId).then(() => {
                this.noteRepository.deleteNoteById(noteId).then((noteEntity) => {
                    resolve(noteEntity);
                }).catch((error) => {
                    reject(new ErrorHandler(500, error.message));
                });
            }).catch((error) => {
                reject(error)
            });
        });
    }
    /**
          *  Used to edit a note.
          *  It sends a request to the authentication service to verify the token.
          *  If the user is authorized the note is editted else an error is returned.
          *  The new image is saved in the directory and overwrites the old image with the same name and sam image path.
          *  Incase an error occured in saving the note image a reject prmoise is returned with error code 500.
          *  Incase an error occured in note editting in DB a reject promise is returned with error code 500.
          *          
          * @params note id
          * @params note Information
          * @params user id
          * @params user token
          *
          * @return a note entity of the editted note
          */
    editNote(userToken, noteInformation, noteId, userId) {
        return new Promise((resolve, reject) => {
            //Convert the input information to json object
            noteInformation = JSON.stringify(noteInformation);
            noteInformation = JSON.parse(noteInformation)
            authenticationService.verifyToken(userToken, userId).then(() => {
                this.noteRepository.editNoteById(noteInformation, noteId).then((noteEntity) => {
                    resolve(noteEntity)
                }).catch((error) => {
                    reject(new ErrorHandler(500, error.message));
                });
            }).catch((error) => {
                reject(error)
            });
        })
    }

    /**
        *  Gets all the notes owned by a certain user.
        *  It sends a request to the authentication service to verify the token.
        *  If the user is authorized the user notes are retrieved else an error is returned.
        *  Incase an error occured while retrieving from the DB a reject promise is returned with 500 error code.
        *
        * @params Id of the user
        *
        * @return list of notes owned by user
        */
    getUserNotes(userToken, userId) {
        return new Promise((resolve, reject) => {
            authenticationService.verifyToken(userToken, userId).then(() => {
                this.noteRepository.getNotesByUserId(userId).then((noteEntity) => {
                    resolve(noteEntity);
                }).catch((error) => {
                    reject(new ErrorHandler(500, error.message));
                });
            }).catch((error) => {
                reject(error);
            });
        });

    }
    /**
           *  Used to get all sharable notes for all users.
           *  It sends a request to the authentication service to verify the token.
           *  If the user is authorized the notes are retrieved from the DB else an error is returned.
           *  Incase an error in retrieval occured from DB a reject promise is returned with error code 500
           *
           * @params user token
           * @params user id
           * 
           * @return list of all notes.
           */
    getAllSharableNotes(userToken, userId) {
        return new Promise((resolve, reject) => {
            authenticationService.verifyToken(userToken, userId).then(() => {
                this.noteRepository.getAllNotesBySharability().then((noteEntity) => {
                    resolve(noteEntity);
                }).catch((error) => {
                    reject(new ErrorHandler(500, error.message));
                });
            }).catch((error) => {
                reject(error)
            });
        });

    }
    /**
      *  Used to save the note image in its directory.The function checks for the
      *  existence of the images folder of the user.If it doesnt exist it is created.
      *  It then writes the image in the user images diesctory with its unique id name.
      *  Incase an error occured in writing the file a reject promise is returned with
      *  error code 500.
      *  
      *          
      * @params note id
      * @params user id
      * @params user token
      *
      * @return image Path relative to the directory
      */
    saveNoteImageInDirectory(noteImage, userId, noteId) {
        return new Promise((resolve, reject) => {
            var noteImagePath = __dirname.concat(imagePath).concat(userId).concat("/").concat(noteId)
            if (!fs.existsSync(__dirname.concat(imagePath))) {
                fs.mkdirSync(__dirname.concat(imagePath), { recursive: true });
            }
            if (!fs.existsSync(__dirname.concat(imagePath).concat(userId))) {
                fs.mkdirSync(__dirname.concat(imagePath).concat(userId), { recursive: true });
            }
            fs.writeFile(noteImagePath, noteImage.buffer, 'binary', function (err) {
                if (err) {
                    reject(new ErrorHandler(500, "Can't save item image in the directory"));
                }
            });
            noteImagePath = "http://localhost" + "/notes/".concat(userId).concat("/").concat(noteId)
            resolve(noteImagePath)
        });
    }
    /**
         *  Used to edit the sharability of a note.
         *  The function sends a request to the authentication service and checks for the authenticity of user.
         *  If user is authentic it sends a request to the repository to edit the sharability attribute.
         *  Incase an error occured in writing in the DB an error code of 500 is returned.
         *  
         *          
         * @params note id
         * @params user id
         * @params user token
         * @params sharable boolean
         *
         * @return editted note entity
         */
    editNoteSharability(userToken, userId, noteId, sharable) {
        return new Promise((resolve, reject) => {
            authenticationService.verifyToken(userToken, userId).then(() => {
                this.noteRepository.editNoteSharability(noteId, sharable).then((noteEntity) => {
                    console.log(noteEntity)

                    resolve(noteEntity)
                }).catch((error) => {
                    reject(new ErrorHandler(500, error.message));
                });
            }).catch((error) => {
                reject(error)
            });
        })
    }


}

module.exports = NoteService
