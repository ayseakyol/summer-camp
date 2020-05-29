const handlers = require("./handlers.js");
const express = require("express");

const router = express.Router();

router.get("/", handlers.readAll);
router.post("/view", handlers.readOne);
router.post("/", handlers.post);
router.post("/change", handlers.update);
router.post("/delete", handlers.delete);

module.exports = router;
