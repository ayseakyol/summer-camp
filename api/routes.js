const handlers = require("./handlers.js");
const express = require("express");

const router = express.Router();

router.get("/participants", handlers.readAll);
router.post("/participants/view", handlers.readOne);
router.post("/participants", handlers.post);
router.post("/participants/change", handlers.update);
router.post("/participants/delete", handlers.delete);

module.exports = router;
