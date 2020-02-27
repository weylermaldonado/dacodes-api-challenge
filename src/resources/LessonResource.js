const router = require('express').Router();
const { verifyAccountType } = require('../middlewares/role.js');
const { verifyUserCourse } = require('../middlewares/courses.js');
const { verifyQuestions } = require('../helpers/questions.js');

const LessonController = require('../controllers/LessonController.js');

router.post('/:courseId/lessons', verifyAccountType, (req, res) => {
    if (!req.params.courseId || !req.body.details || !req.body.approvalScore || !req.body.questions) {
        return res.status(422).json({ status: 'error', message: 'Missing fields in the request' });
    }

    const { isCorrect, message } = verifyQuestions(req.body.questions);

    if (!isCorrect) {
        return res.status(422).json({ status: 'error', message });
    }

    const contextRequest = {
        courseId: req.params.courseId,
        details: req.body.details,
        approvalScore: req.body.approvalScore,
        questions: req.body.questions
    };
    
    LessonController.createLessonByCourseId(contextRequest)
        .then(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        })
        .catch(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        });
});

router.patch('/:courseId/lessons/:lessonId', verifyAccountType, (req, res) => {
    if (!req.params.courseId || !req.params.lessonId || !req.body.details || !req.body.approvalScore || !req.body.questions) {
        return res.status(422).json({ status: 'error', message: 'Missing fields in the request' });
    }

    const { isCorrect, message } = verifyQuestions(req.body.questions);

    if (!isCorrect) {
        return res.status(422).json({ status: 'error', message });
    }

    const contextRequest = {
        courseId: req.params.courseId,
        lessonId: req.params.lessonId,
        details: req.body.details,
        approvalScore: req.body.approvalScore,
        questions: req.body.questions
    };

    LessonController.updateLessonAndQuestions(contextRequest)
        .then(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        })
        .catch(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        });
});

router.delete('/:courseId/lessons/:lessonId', verifyAccountType, (req, res) => {
    if (!req.params.courseId || !req.params.lessonId) {
        return res.status(422).json({ status: 'error', message: 'Missing fields in the request' });
    }

    const contextRequest = {
        courseId: req.params.courseId,
        lessonId: req.params.lessonId,
    };

    LessonController.deleteLessonAndQuestions(contextRequest)
        .then(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        })
        .catch(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        });
});

router.get('/:courseId/lessons', verifyUserCourse, (req, res) => {
    if (!req.params.courseId) {
        return res.status(422).json({ status: 'error', message: 'Missing fields in the request' });
    }

    const contextRequest = { courseId: req.params.courseId };

    LessonController.getLessonByCourseId(contextRequest)
        .then(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        })
        .catch(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        });
});

router.get('/:courseId/lessons/:lessonId/details', verifyUserCourse,(req, res) => {
    if (!req.params.courseId || !req.params.lessonId) {
        return res.status(422).json({ status: 'error', message: 'Missing fields in the request' });
    }

    const contextRequest = { 
        courseId: req.params.courseId,
        lessonId: req.params.lessonId 
    };

    LessonController.getLessonDetails(contextRequest)
        .then(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        })
        .catch(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        });
});

router.post('/:courseId/lessons/:lessonId/study', verifyUserCourse, (req, res) => {
    if (!req.params.courseId || !req.params.lessonId || !req.body.answers || !req.body.questionId) {
        return res.status(422).json({ status: 'error', message: 'Missing fields in the request' });
    }

    const contextRequest = {
        questionId: req.body.questionId,
        courseId: req.params.courseId,
        lessonId: req.params.lessonId,
        answers: req.body.answers,
        payload: req.payload
    };

    LessonController.takeLesson(contextRequest)
        .then(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        })
        .catch(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        });


});


module.exports = router;