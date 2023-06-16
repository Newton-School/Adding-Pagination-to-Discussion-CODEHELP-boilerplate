const express = require("express");

const { getAllDiscussion, getDiscussion, createDiscussion, deleteDiscussion, updateDiscussion } = require("../controllers/discussionControllers");
const { isoOwnerOrAdmin } = require("../middleware/discussionMiddleware.js");

const router = express.Router();

router.get("/", getAllDiscussion);
router.get("/:id", getDiscussion);
router.post("/create", createDiscussion);
router.post("/delete/:id", isoOwnerOrAdmin, deleteDiscussion );
router.post("/update/:id", isoOwnerOrAdmin, updateDiscussion);

module.exports = router;