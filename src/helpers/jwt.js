const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate the JWT token.
 * @param {Object} user Is the payload to append in the token.
 * @returns {String} Token
 */
function generateToken(user) {
  const verificationToken = crypto.randomBytes(16).toString('hex');
  const token = jwt.sign({ user, verificationToken }, process.env.SECRET_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });

  return token;
}
/**
 * Decode the token.
 * @param {String} token Current token
 * @returns {Promise} Payload
 */
function decodeToken(token) {
  return new Promise((fulfill, reject) => {
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
      if (err) {
        return reject({ status: 'error', httpStatus: 503, message: 'Invalid token.' });
      }
      const payload = decoded.user;
      return fulfill(payload);
    });
  });
}

module.exports = { generateToken, decodeToken };
