const typeOrm = require("typeorm");
const entitySchema = typeOrm.EntitySchema;

const user = new entitySchema({
  name: "User",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    email: {
      type: "varchar",
      unique: true,
      required: true
    },
    password: {
      type: "varchar",
      required: true
    },
    userName:
    {
      type: "varchar",
      required: true
    },
    fullName: {
      type: "varchar",
      required: true

    }
  },
  relations: {
    notes: {
      target: "Note",
      type: "one-to-many",
      joinTable: true,
      cascade: true
    }
  }
});
module.exports = user;