const router = require('express').Router();
const usersRoute = require('./users-routes');
const thoughtRoute = require('./thoughts-routes');

router.use('/api/users', usersRoute);
router.use('/api/thoughts', thoughtRoute);

module.exports = router