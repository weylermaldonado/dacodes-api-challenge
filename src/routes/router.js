const router = require('express').Router();
const UserResource = require('../resources/AthenticationResource.js');
const CourseResource = require('../resources/CoursesResource.js');
const LessonResource = require('../resources/LessonResource.js');

const { verifyToken } = require('../middlewares/auth.js');

router.use('/auth', UserResource);
router.use('/courses', verifyToken, CourseResource);  
router.use('/courses', verifyToken, LessonResource);  


module.exports = router;