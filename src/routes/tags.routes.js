const {Router} = require("express")
const TagsController = require("../controller/TagsController");

const  tagsRouter = Router();
const tagsController = new TagsController();

tagsRouter.get("/", tagsController.index)

module.exports = tagsRouter;

