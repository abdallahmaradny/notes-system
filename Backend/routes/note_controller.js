const router = require('express').Router();
const noteService = new (require("../services/note_service.js"));
var multer = require('multer')
var upload = multer()

/*---------Save a note for a user---------*/
/**
 * /note/{userId}
 *  post:
 *    description: Route used to add note to user 
 *    consumes: 
 *      - multipart-formdata
 *    parameters:
 *       -userId
 *    requestBody:
 *        content:
 *          multipart/form-data:
 *         -req body(title,description)
 *         -file(image)
 *    headers:
 *       authorization jwt token
 *    responses:
 *      '200': 
 *        added note entity
 *      '500':
 *        description: Internal Server Error
 *      '401':
 *        description: Invalid id or Invalid token
 *      '404':
 *        description: User doesn't exist
 */
router.post("/note/:userId", upload.single("image"), function (req, res) {
    noteService.addNewNote(req.headers.authorization.split(' ')[1], req.body, req.params.userId, req.file).then((addedNote) => {
        res.send(addedNote)
    }).catch(err => { res.status(err.statusCode).send({ error: err.message }) });
});
/*---------Get All Sharable notes---------*/
/**
 * /note/notes/{userId}
 *  get:
 *    description: Route used to get all sharable notes for all users
 *    parameters:
 *       -userId
 *    headers:
 *       authorization jwt token
 *    responses:
 *      '200': 
 *        array of json object notes
 *      '500':
 *        description: Internal Server Error
 *      '401':
 *        description: Invalid id or Invalid token
 */
router.get("/note/notes/:userId", function (req, res) {
    noteService.getAllSharableNotes(req.headers.authorization.split(' ')[1], req.params.userId).then((notes) => {
        res.send(notes)
    }).catch(err => { res.status(err.statusCode).send({ error: err.message }) });
});
/*---------Get user notes---------*/
/**
 * /note/{userId}
 *  get:
 *    description: Route used to get notes for a user
 *    parameters:
 *       -userId
 *    headers:
 *       authorization jwt token
 *    responses:
 *      '200': 
 *        array of json object notes
 *      '500':
 *        description: Internal Server Error
 *      '401':
 *        description: Invalid id or Invalid token
 */
router.get("/note/:userId", function (req, res) {
    noteService.getUserNotes(req.headers.authorization.split(' ')[1], req.params.userId).then((addedNote) => {
        res.send(addedNote)
    }).catch(err => { res.status(err.statusCode).send({ error: err.message }) });
});
/*---------Delete a note for a user---------*/
/**
 * /note/{noteId}/{userId}
 *  delete:
 *    description: Route used to delete a note for a user
 *    parameters:
 *       -userId
 *       -noteId
 *    headers:
 *       authorization jwt token
 *    responses:
 *      '200': 
 *      '500':
 *        description: Internal Server Error
 *      '401':
 *        description: Invalid id or Invalid token
 */
router.delete("/note/:noteId/:userId", function (req, res) {
    noteService.deleteNote(req.headers.authorization.split(' ')[1], req.params.noteId, req.params.userId).then((deletedNote) => {
        res.send();
    }).catch(err => { res.status(err.statusCode).send({ error: err.message }) });
});
/*---------Edit a note for a user---------*/
/**
 * /note/{noteId}/{userId}
 *  put:
 *    description: Route used to edit a note for a user
 *    parameters:
 *       -userId
 *       -noteId
 *    headers:
 *       authorization jwt token
 *    responses:
 *      '200': 
 *        editted note
 *      '500':
 *        description: Internal Server Error
 *      '401':
 *        description: Invalid id or Invalid token
 */
router.put('/note/:noteId/:userId', function (req, res) {
    noteService.editNote(req.headers.authorization.split(' ')[1], req.body, req.params.noteId, req.params.userId).then((edittedNote) => {
        res.send(edittedNote);
    }).catch(err => { res.status(err.statusCode).send({ error: err.message }) });
});
/*---------Edit note sharability---------*/
/**
 * /note/{noteId}/sharable/{userId}
 *  put:
 *    description: Route used to edit a note for a user
 *    parameters:
 *       -userId
 *       -noteId
 *    query params:
 *       -sharability boolean
 *    headers:
 *       authorization jwt token
 *    responses:
 *      '200': 
 *        editted note
 *      '500':
 *        description: Internal Server Error
 *      '401':
 *        description: Invalid id or Invalid token
 */
router.put("/note/:noteId/sharable/:userId", function (req, res) {
     noteService.editNoteSharability(req.headers.authorization.split(' ')[1], req.params.userId,req.params.noteId,req.query.sharable).then((edittedNote) => {
        res.send(edittedNote)
    }).catch(err => { res.status(err.statusCode).send({ error: err.message }) });
});

module.exports = router