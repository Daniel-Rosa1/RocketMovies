const {Router} = require("express")
const usersRoutes = require("./users.routes")
const NotesRoutes = require("./moviesNotes.routes")
const tagsRoutes = require("./tags.routes")

const routes = Router();

routes.use("/users", usersRoutes)
routes.use("/movieNotes", NotesRoutes)
routes.use("/tags", tagsRoutes)



module.exports = routes;