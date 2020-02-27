const router = require('express').Router();
const UserController = require('../controllers/UserController.js');

router.post('/signup', (req, res) => {
    if (!req.body.email || !req.body.name || !req.body.password || !req.body.type) {
        return res.status(422).json({ status: 'error', message: 'Missing fields in the request' });
    } 

    const contextRequest = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        type: req.body.type
    };
    
    UserController.signUp(contextRequest)
        .then(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        })
        .catch(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        });
});

router.post('/login', (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(422).json({ status: 'error', message: 'Missing fields in the request' });
    } 

    const contextRequest = {
        email: req.body.email,
        password: req.body.password
    };
    
    UserController.login(contextRequest)
        .then(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        })
        .catch(({ status, data, httpStatus }) => {
            return res.status(httpStatus).json({ status, data });
        });
});

module.exports = router;
