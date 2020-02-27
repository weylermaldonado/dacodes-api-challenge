const Course = require('../models/Course.js');
const User = require('../models/User.js');
const UserCourses = require('../models/User-Courses.js');

class CourseService {

    getCourses() {
        return new Promise((resolve, reject) => {
            Course
                .query()
                .then((courses) => {
                    return resolve({ available_courses: courses });
                })
                .catch((err) => {
                    return reject({ httpStatus: 500, message: err.message });
                });
        });
    }

    getUserCourses({ payload }, availableCourses) {
        return new Promise((resolve, reject) => {
            User
                .relatedQuery('courses')
                .for(payload.user_id)
                .then((courses) => {
                    return resolve({ user_courses: courses, ...availableCourses });
                })
                .catch((err) => {
                    return reject({ httpStatus: 500, message: err.message });
                });
        });
    }

    registerAUserToCourse({ payload, courseId }) {
        return new Promise((resolve, reject) => {
            this.alreadyHaveThatCourse(courseId, payload.user_id)
                .then((haveThatCourse) => {
                   if (haveThatCourse) {
                       return resolve({ message: 'The user already have that course.'})
                   }
                   UserCourses
                       .query()
                       .insert({
                           user_id: payload.user_id,
                           course_id: courseId
                       })
                       .then((result) => {
                           return resolve(result);
                       })
                       .catch((err) => {
                           return reject({ httpStatus: 500, message: err.message });
                       });
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    }

    alreadyHaveThatCourse(courseId, userId) {
        return new Promise((resolve, reject) => {
            UserCourses
                .query()
                .where({ user_id: userId })
                .where({ course_id: courseId })
                .then((result) => {
                    const haveThatCourse = result.length === 0 ? false : true;
                    return resolve(haveThatCourse);
                })
                .catch((err) => {
                    return reject({ httpStatus: 500, message: err.message });
                });
        });
    }

    storeCourse({ name, description, type }) {
        return new Promise((resolve, reject) => {
            Course
                .query()
                .insert({
                    course_name: name,
                    course_description: description,
                    course_type: type,
                    aprroved: 0
                })
                .then((result) => {
                    return resolve(result);
                })
                .catch((err) => {
                    return reject({ httpStatus: 500, message: err.message });
                });
        });
    }

    updateCourseById({ courseId, name, description, type }) {
        return new Promise((resolve, reject) => {
            Course
                .query()
                .patchAndFetchById(courseId, {
                    course_name: name,
                    course_description: description,
                    course_type: type,
                    aprroved: 0
                })
                .throwIfNotFound()
                .then((result) => {
                    return resolve(result);
                })
                .catch((err) => {
                    return reject({ httpStatus: err.statusCode || 500, message: err.message });
                });
        });
    }

    deleteCourseById({ courseId }) {
        return new Promise((resolve, reject) => {
            Course
                .query()
                .deleteById(courseId)
                .throwIfNotFound()
                .then(() => {
                    return resolve({ message: 'Course deleted successfully.' });
                })
                .catch((err) => {
                    return reject({ httpStatus: err.statusCode || 500, message: err.message });
                });

        });
    }

    storeLessonForCourse({ courseId, details, approvalScore }) {
        return new Promise((resolve, reject) => {
            Course
                .relatedQuery('lessons')
                .for(courseId)
                .insert({
                    details: details,
                    approval_score: approvalScore
                })
                .then((lesson) => {
                    return resolve(lesson);
                })
                .catch((err) => {
                    return reject({ httpStatus: err.statusCode || 500, message: err.message });
                });
        });
    }

}

module.exports = CourseService;