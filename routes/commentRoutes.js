const express = require("express");

const { createComment, getComment, deleteComment, updateComment } = require("../controllers/commentControllers");
const { isoOwnerOrAdmin } = require("../middleware/commentMiddleware.js");
const router = express.Router();

router.get("/:id", getComment);
router.post("/create", createComment);
router.post("/delete/:id", isoOwnerOrAdmin, deleteComment);
router.post("/update/:id", isoOwnerOrAdmin, updateComment);

module.exports = router;