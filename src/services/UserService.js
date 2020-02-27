const AccountType = require('../models/AccountTypes.js');
const User = require('../models/User.js');
const { generateToken } = require('../helpers/jwt.js');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');

class UserService {

    storeUser({ name, email, password, type }) {
        return new Promise((resolve, reject) => {
            this.setAccountType(type)
                .then((accountType) => {
                    User
                        .query()
                        .insert({
                            user_name: name,
                            user_email: email,
                            user_password: this.hashPassword(password),
                            account_type_id: accountType.account_type_id
                        })
                        .then(() => { return resolve({ message: 'User created.' })})
                        .catch((err) => {
                            return reject({ httpStatus: 500, message: err.message });
                        })
                })
                .catch((err) => {
                    return reject({ httpStatus: err.httpStatus, message: err.message });
                });
        });
    }

    setAccountType(type) {
        return new Promise((resolve, reject) => {
            AccountType
                .query()
                .findOne({ account_name: type })
                .throwIfNotFound()
                .then((accountType) => {
                    return resolve(accountType);
                })
                .catch((error) => {
                    return reject({ httpStatus: 404, message: error.message });
                })
        });
    }

    hashPassword(password) {
        const saltRounds = 10;
        const salt = genSaltSync(saltRounds);
        return hashSync(password, salt);
    }

    findUserByEmail(email) {
        return new Promise((resolve, reject) => {
            User
                .query()
                .findOne({ user_email: email })
                .select('user_id','user_name', 'user_email', 'account_type_id', 'user_password')
                .throwIfNotFound()
                .then((user) => {
                    return resolve(user);
                })
                .catch((err) => {
                    return reject({ httpStatus: 404, message: err.message });
                });
        });
    }

    comparePassword(user, password) {
        return new Promise((resolve, reject) => {
            const match = compareSync(password, user.user_password);
            if (!match) {
                return reject({ httpStatus: 401, message: 'Incorrect email or password.' });
            }
            return resolve(user);
        });
    }

    prepareUser({ email, password }) {
        return new Promise((resolve, reject) => {
            this.findUserByEmail(email)
            .then((user) => this.comparePassword(user, password))
            .then((user) => {
                user.authToken = generateToken(user);
                delete user.user_password;
                return resolve(user);
            })
            .catch((error) => {
                return reject(error);
            });
        });
    }
}

module.exports = UserService;