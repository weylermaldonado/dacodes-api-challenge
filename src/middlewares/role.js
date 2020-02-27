
const AccountType = require('../models/AccountTypes.js');
function verifyAccountType(req, res, next) {
    AccountType
        .query()
        .findById(req.payload.account_type_id)
        .throwIfNotFound()
        .then((accountType) => {
            if (accountType.account_name === 'teacher') {
                next();
            } else {
                return res.status(405).json({ status: 'error', message: 'Only teacher can create courses, question or lessons.' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ status: 'error', message: err.message });
        });
}

module.exports = { verifyAccountType };