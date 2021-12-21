const typeOrm = require("typeorm");
const entitySchema = typeOrm.EntitySchema;

const note = new entitySchema({
  name: "Note",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    title: {
      type: "varchar",
      required: true
    },
    description: {
      type: "varchar",
      required: true
    },
    imagePath: {
      type: "varchar",
      nullable:true
    },
    sharable:{
      type:"boolean",
      default:true
    }
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinTable: true,
      cascade: false,
    }
  }
});
module.exports = note;