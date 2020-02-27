const router = require('express').Router();
const CourseController = require('../controllers/CourseController.js');
const { verifyAccountType } = require('../middlewares/role.js');

router.get('/', (req, res) => {
    
    const contextRequest = {
        payload: req.payload
    };

    CourseController.getAllCourses(contextRequest)
        .then(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        })
        .catch(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        });

});

router.post('/:courseId/register', (req, res) => {

    if (!req.params.courseId) {
        return res.status(422).json({ status: 'error', message: 'Missing fields in the request' });
    }

    const contextRequest = {
        payload: req.payload,
        courseId: req.params.courseId
    };

    CourseController.registerToCourse(contextRequest)
        .then(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        })
        .catch(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        });
});

router.post('/', verifyAccountType, (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.type) {
        return res.status(422).json({ status: 'error', message: 'Missing fields in the request' });
    }

    const contextRequest = {
        name: req.body.name,
        description: req.body.description,
        type: req.body.type
    };
    
    CourseController.createCourse(contextRequest)
        .then(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        })
        .catch(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        });
});

router.patch('/:courseId', verifyAccountType, (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.type || !req.params.courseId) {
        return res.status(422).json({ status: 'error', message: 'Missing fields in the request' });
    }

    const contextRequest = {
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        courseId: req.params.courseId
    };
    
    CourseController.updateCourse(contextRequest)
        .then(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        })
        .catch(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        });
});

router.delete('/:courseId', verifyAccountType, (req, res) => {
    if (!req.params.courseId) {
        return res.status(422).json({ status: 'error', message: 'Missing fields in the request' });
    }

    const contextRequest = {
        courseId: req.params.courseId
    };

    CourseController.deleteCourse(contextRequest)
        .then(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        })
        .catch(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        });
});

module.exports = router;