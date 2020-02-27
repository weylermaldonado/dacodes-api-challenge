const CourseService = require('../services/CourseService.js');
const LessonService = require('../services/LessonService.js');

class LessonController {

    constructor() {
        this.courseService = new CourseService();
        this.lessonService = new LessonService();
    }

    createLessonByCourseId(contextRequest) {
        return new Promise((resolve, reject) => {
            this.courseService.storeLessonForCourse(contextRequest)
                .then(async(lesson) => await this.lessonService.saveQuestionsToLesson(contextRequest.questions, lesson))
                .then(({ questions, lesson }) => {
                    return resolve({ status: 'success', httpStatus: 201, data: { lesson: { ...lesson, questions } } });
                })
                .catch((error) => {
                    return reject({ status: 'error', httpStatus: error.httpStatus, data: error});
                });
        });
    }

    getLessonByCourseId(contextRequest) {
        return new Promise((resolve, reject) => {
            this.lessonService.getLessonsByCourseId(contextRequest)
                .then(async(instances) => await this.lessonService.getLessonsWithQuestionsById(contextRequest))
                .then((lessonData) => {
                    return resolve({ status: 'success', httpStatus: 200, data: lessonData });
                })
                .catch((error) => {
                    console.log(error);
                    return reject({ status: 'error', httpStatus: error.httpStatus, data: error});
                });
        });
    }

    getLessonDetails(contextRequest) {
        return new Promise((resolve, reject) => {
            this.lessonService.getLessonDetailsByCourse(contextRequest)
                .then((lessonData) => {
                    return resolve({ status: 'success', httpStatus: 200, data: lessonData });
                })
                .catch((error) => {
                    console.log(error);
                    return reject({ status: 'error', httpStatus: error.httpStatus, data: error});
                });
        });
    }

    updateLessonAndQuestions(contextRequest) {
        return new Promise((resolve, reject) => {
            this.lessonService.updateLessonById(contextRequest)
                .then(async(lesson) => this.lessonService.updateQuestionsByLessonId(contextRequest, lesson))
                .then((lessonData) => {
                    return resolve({ status: 'success', httpStatus: 201, data: lessonData });
                })
                .catch((error) => {
                    console.log(error);
                    return reject({ status: 'error', httpStatus: error.httpStatus, data: error});
                });
        });
    }

    deleteLessonAndQuestions(contextRequest) {
      return new Promise((resolve, reject) => {
        this.lessonService.deleteLessonBydId(contextRequest)
            .then((lessonData) => {
                return resolve({ status: 'success', httpStatus: 204, data: lessonData });
            })
            .catch((error) => {
                console.log(error);
                return reject({ status: 'error', httpStatus: error.httpStatus, data: error});
            });
      });
    }

    takeLesson(contextRequest) {
        return new Promise((resolve, reject) => {
            this.lessonService.getQuestionTypeById(contextRequest)
                .then((question) => this.lessonService.evaluateAnswersByQuestionType(question, contextRequest.answers))
                .then((score) => this.lessonService.approveCourseBYId(contextRequest, score))
                .then((courseData) => {
                    return resolve({ status: 'success', httpStatus: 201, data: courseData });
                })
                .catch((error) => {
                    console.log(error);
                    return reject({ status: 'error', httpStatus: error.httpStatus, data: error});
                });
        });
    }
}

module.exports = new LessonController();