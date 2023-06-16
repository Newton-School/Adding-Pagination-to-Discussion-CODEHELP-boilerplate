const express = require("express");

const { createQuestion, getQuestion, deleteQuestion, updateQuestion } = require("../controllers/questionControllers");
const { isoOwner } = require("../middleware/questionMiddleware.js");
const router = express.Router();

router.get("/", getQuestion);
router.post("/create", createQuestion);
router.delete("/delete/:id", isoOwner, deleteQuestion);
router.patch("/update/:id", isoOwner, updateQuestion);

module.exports = router;