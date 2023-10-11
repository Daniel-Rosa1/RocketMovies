const {Router} = require("express")
const MovieNotesController = require("../controller/MoviesNotesController");

const  notesRouter = Router();
const notesController = new MovieNotesController();

notesRouter.get("/index", notesController.index)
notesRouter.post("/", notesController.create)
notesRouter.get("/show", notesController.show)
notesRouter.delete("/", notesController.delete)


module.exports = notesRouter;

