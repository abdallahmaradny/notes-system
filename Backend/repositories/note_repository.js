const noteEntity = require("../entities/note.js");
const typeOrm = require("typeorm");
const getRepository = typeOrm.getRepository;
class NoteRepository {

  /**
   *  Creates an entity of the new note with a relation to an existing user
   *  The save new note entity contains the userId owning the note
   *
   * @params attributes to save a new note and the userEntity owning the note
   *
   * @return entity of created note
   */
  async saveNewNote(newNote, userEntity) {
    newNote.user = userEntity
    const noteRepository = getRepository(noteEntity);
    return await noteRepository.save(newNote);
  }
  /**
    *  Deletes the note from the DB 
    *
    * @params noteId in DB
    *
    * @return confirmation if deleted 
    */
  async deleteNoteById(noteId) {
    const noteRepository = getRepository(noteEntity);
    return await noteRepository.delete(noteId);
  }
  /**
    * Edits a note in the DB 
    *
    * @params noteId in DB and new note information
    *
    * @return editted note entity
    */
  async editNoteById(noteInfo, noteId) {
    const noteRepository = getRepository(noteEntity);
    await noteRepository.update(noteId, noteInfo);
    return await noteRepository.findOne(noteId);
  }
  /**
   * It left joins the user and the note entity using the foreign key userId and returns notes
   * that matches the given id.It returns only the note attributes without the whole joined entity 
   *
   * @params userId in DB
   *
   * @return list of notes
   */
  async getNotesByUserId(userId) {
    const noteRepository = getRepository(noteEntity);
    return await noteRepository.createQueryBuilder("note")
      .leftJoinAndSelect("note.user", "user")
      .andWhere("user.id = :id", { id: userId })
      .select("note")
      .getMany()

  }

  /**
   * Gets all notes by sharability in the DB
   * @return list of notes in DB
   */
  async getAllNotesBySharability() {
    const noteRepository = getRepository(noteEntity);
    return await noteRepository.find({ sharable: true });
  }
  /**
       * Edits note sharability in the DB 
       *
       * @params noteId in DB
       * @params sharability boolean
       *
       * @return editted note entity
       */
  async editNoteSharability(noteId, sharable) {
    const noteRepository = getRepository(noteEntity);
    await noteRepository.update(noteId, { sharable: sharable });
    return await noteRepository.findOne(noteId);

  }
}

module.exports = NoteRepository

