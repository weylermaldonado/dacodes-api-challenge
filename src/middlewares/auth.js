const { decodeToken } = require('../helpers/jwt.js');


function verifyToken(req, res, next) {
    let token = req.get('Authorization');
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized.' });
    }
    token = token.replace('Bearer ', '');

    decodeToken(token)
        .then((payload) => {
            req.payload = payload;
            next();
        })
        .catch(({ status, httpStatus, message }) => {
            return res.status(httpStatus).json({ status, message });
        });
}

module.exports = { verifyToken };