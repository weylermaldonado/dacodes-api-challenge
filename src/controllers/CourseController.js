const CourseService = require('../services/CourseService.js');


class CourseController {

    constructor() {
        this.service = new CourseService();
    }

    getAllCourses(contextRequest) {
        return new Promise((resolve, reject) => {
            this.service.getCourses()
                .then((courses) => this.service.getUserCourses(contextRequest, courses))
                .then((result) => {
                    return resolve({ status: 'success', httpStatus: 200, data: result });
                })
                .catch((error) => {
                    console.log(error);
                    return reject({ status: 'error', httpStatus: error.httpStatus, data: error});
                });
        });
    }

    registerToCourse(contextRequest) {
        return new Promise((resolve, reject) => {
            this.service.registerAUserToCourse(contextRequest)
                .then((result) => {
                    return resolve({ status: 'success', httpStatus: 200, data: result });
                })
                .catch((error) => {
                    console.log(error);
                    return reject({ status: 'error', httpStatus: error.httpStatus, data: error});
                });
        });
    }

    createCourse(contextRequest) {
        return new Promise((resolve, reject) => {
            this.service.storeCourse(contextRequest)
                .then((result) => {
                    return resolve({ status: 'success', httpStatus: 201, data: result });
                })
                .catch((error) => {
                    return reject({ status: 'error', httpStatus: error.httpStatus, data: error});
                });
        });
    }

    updateCourse(contextRequest) {
        return new Promise((resolve, reject) => {
            this.service.updateCourseById(contextRequest)
                .then((result) => {
                    return resolve({ status: 'success', httpStatus: 201, data: result });
                })
                .catch((error) => {
                    return reject({ status: 'error', httpStatus: error.httpStatus, data: error});
                });
        });
    }

    deleteCourse(contextRequest) {
        return new Promise((resolve, reject) => {
            this.service.deleteCourseById(contextRequest)
                .then((result) => {
                    return resolve({ status: 'success', httpStatus: 204, data: result });
                })
                .catch((error) => {
                    return reject({ status: 'error', httpStatus: error.httpStatus, data: error});
                });
        });
    }

}

module.exports = new CourseController();