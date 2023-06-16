const router = require('express').Router();

router.use('/discussion/', require('./discussionRoutes'));
router.use('/user', require('./userRoutes'));
router.use('/comment', require('./commentRoutes'));
router.use('/question', require('./questionRoutes'));

module.exports = router;