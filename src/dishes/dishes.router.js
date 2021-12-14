const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
    .route("/")
    .post(controller.create)
    .get(controller.list)
    .all(methodNotAllowed)

router
    .route("/:dishId")
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed)
module.exports = router;