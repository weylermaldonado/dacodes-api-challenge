const UserCourse = require('../models/User-Courses.js');

function verifyUserCourse(req, res, next) {
    UserCourse
        .query()
        .where({ user_id: req.payload.user_id })
        .where({ course_id: req.params.courseId })
        .throwIfNotFound()
        .then((result) => {
            next();
        })
        .catch((err) => {
            return res.status(405).json({ status: 'error', message: 'You haven\'t registered for this course.' });
        });
}

module.exports = { verifyUserCourse };