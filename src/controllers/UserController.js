const UserService = require('../services/UserService.js');

class UserController {

    constructor() {
        this.service = new UserService();
    }

    signUp(contextRequest) {
        return new Promise((resolve, reject) => {
            this.service.storeUser(contextRequest)
                .then((result) => {
                    return resolve({ status: 'success', httpStatus: 200, data: result });
                })
                .catch((error) => {
                    return reject({ status: 'error', httpStatus: error.httpStatus, data: error});
                });
        });
    }

    login(contextRequest) {
        return new Promise((resolve, reject) => {
            this.service.prepareUser(contextRequest)
                .then((result) => {
                    return resolve({ status: 'success', httpStatus: 200, data: result });
                })
                .catch((error) => {
                    return reject({ status: 'error', httpStatus: error.httpStatus, data: error});
                });
        });
    }
}

module.exports = new UserController();