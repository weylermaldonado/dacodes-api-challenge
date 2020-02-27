const Question = require('../models/Question.js');
const Lesson = require('../models/Lesson.js');
const Course = require('../models/Course.js');
const CourseLessonQuestion = require('../models/Course-Lesson-Question.js');
const ApprovedCourses = require('../models/ApprovedCourses.js');

class LessonService {

    async saveQuestionsToLesson(questions, lesson) {
        const questionsEntries = [];
        for (const question of questions) {
            const questionEntry = await Question
                                    .query()
                                    .insert({
                                        question_text: question.text,
                                        question_type: question.type,
                                        answers: JSON.stringify(question.answers)
                                    })
                                    .catch((err) => {
                                        return { httpStatus: err.statusCode || 500, message: err.message };
                                    });

            await CourseLessonQuestion
                    .query()
                    .patch({ question_id: questionEntry.question_id })
                    .where({ lesson_id: lesson.lesson_id })
                    .catch((err) => {
                        return { httpStatus: err.statusCode || 500, message: err.message };
                    });
            questionsEntries.push(questionEntry);
        }
        for (const question of questionsEntries) {
            question.answers = JSON.parse(question.answers);
        }
        return { questions: questionsEntries, lesson };
    }

    async getLessonsWithQuestionsById({ courseId }) {
        const lessons = await Course
                                .relatedQuery('lessons')
                                .for(courseId) 
                                .catch((err) => {
                                    return { httpStatus: err.statusCode || 500, message: err.message };
                                });
            
        for (const lesson of lessons) {
                const questions = await lesson
                        .$relatedQuery('questions')
                        .catch((err) => {
                            return { httpStatus: err.statusCode || 500, message: err.message };
                        });
                for (const question of questions) {
                        question.answers = JSON.parse(question.answers);
                }
                        
            lesson.questions = questions;
        }
        return lessons;
    }

    getLessonsByCourseId({ courseId }) {
        return new Promise((resolve, reject) => {
            CourseLessonQuestion
                .query()
                .where({ course_id: courseId })
                .throwIfNotFound()
                .then((instances) => {
                    return resolve(instances);
                })
                .catch((err) => {
                    return reject({ httpStatus: err.statusCode || 500, message: err.message });
                })
        });
    }

    getLessonDetailsByCourse({ lessonId }) {
        return new Promise((resolve, reject) => {
            Lesson
                .query()
                .findById(lessonId)
                .then(async(lesson) => {
                    const questions = await lesson.$relatedQuery('questions');
                    for (const question of questions) {
                        question.answers = JSON.parse(question.answers);
                    }
                    lesson.questions = questions;
                    return resolve(lesson);
                })
                .catch((err) => {
                    return reject({ httpStatus: err.statusCode || 500, message: err.message });
                });
        });
    }

    updateLessonById(contextRequest) {
        return new Promise((resolve, reject) => {
            Lesson
                .query()
                .patchAndFetchById(contextRequest.lessonId, {
                    details: contextRequest.details,
                    approval_score: contextRequest.approvalScore
                })
                .throwIfNotFound()
                .then((lesson) => {
                    return resolve(lesson);
                })
                .catch((err) => {
                    return reject({ httpStatus: err.statusCode || 500, message: err.message });
                });
        });
    }

    async updateQuestionsByLessonId({ questions }, lesson) {
        const questionsEntries = [];
        for (const question of questions) {
            const questionEntry = await Question
                                    .query()
                                    .patchAndFetchById(question.questionId, {
                                        question_text: question.text,
                                        question_type: question.type,
                                        answers: JSON.stringify(question.answers)
                                    })
                                    .catch((err) => {
                                        return { httpStatus: err.statusCode || 500, message: err.message };
                                    });
            questionsEntries.push(questionEntry);
        }

        for (const entry of questionsEntries) {
            entry.answers = JSON.parse(entry.answers);
        }

        return {  lesson: { ...lesson, questions: questionsEntries } };
    }

    deleteLessonBydId({ lessonId }) {
        return new Promise((resolve, reject) => {
            Lesson
                .query()
                .deleteById(lessonId)
                .then(() => {
                    return resolve({ message: 'Delete successfully.' });
                })
                .catch((err) => {
                    return reject({ httpStatus: err.statusCode || 500, message: err.message });
                });
        });
    }

    getQuestionTypeById({ questionId }) {
        return new Promise((resolve, reject) => {
            Question
                .query()
                .findById(questionId)
                .throwIfNotFound()
                .then((question) => {
                    question.answers = JSON.parse(question.answers);
                    return resolve(question);
                })
                .catch((err) => {
                    return reject({ httpStatus: err.statusCode || 500, message: err.message });
                });
        });
    }

    evaluateAnswersByQuestionType(question, userAnswers) {
        const questionType = question.question_type;
        switch (questionType) {
            case 'boolean':
                return this.evaluateBooleanQuestions(question.answers, userAnswers);
            case 'only-one':
                return this.evaluateOnlyOneQuestion(question.answers, userAnswers);
            case 'more-than-one':
                return this.evaluateMoreThanOneQuestions(question.answers, userAnswers);
            case 'more-than-one-all':
                return this.evaluateMoreThanOneAllQuestions(question.answers, userAnswers);
            default:
                break;
        }
    }

    evaluateBooleanQuestions(questionAnswers, userAnswers) {
        return new Promise((resolve, reject) => {
             const answer = questionAnswers.find(element => element.text === userAnswers[0].text);
             if (!answer) return reject({ httpStatus: 400, message: 'The questions doesn\'t exists.' })
             answer.isCorrect ? resolve(answer.score) : resolve(0);
        });
    }
    
    evaluateOnlyOneQuestion(questionAnswers, userAnswers) {
        return new Promise((resolve, reject) => {
            const answer = questionAnswers.find(element => element.text === userAnswers[0].text);
            if (!answer) return reject({ httpStatus: 400, message: 'The questions doesn\'t exists.' })
            answer.isCorrect ? resolve(answer.score) : resolve(0);
        });
    }

    evaluateMoreThanOneQuestions(questionAnswers, userAnswers) {
        return new Promise((resolve, reject) => {
            let accumulatorScore = 0;
           for (const answer of userAnswers) {
               const currentAnswer = questionAnswers.find(element => element.text === answer.text);
               if (!answer) return reject({ httpStatus: 400, message: 'The questions doesn\'t exists.' })
               if (currentAnswer.isCorrect) accumulatorScore += currentAnswer.score;
            }

            return resolve(accumulatorScore);
        });
    }

    evaluateMoreThanOneAllQuestions(questionAnswers, userAnswers) {
        return new Promise((resolve, reject) => {
            if (questionAnswers.length !== userAnswers.length) {
                return reject({ message: 'All the question should answered.' });
            }
            let accumulatorScore = 0;
            for (const answer of userAnswers) {
                const currentAnswer = questionAnswers.find(element => element.text === answer.text);
                if (!answer) return reject({ httpStatus: 400, message: 'The questions doesn\'t exists.' })
                if (currentAnswer.isCorrect) accumulatorScore += currentAnswer.score;
             }
 
             return resolve(accumulatorScore);
        });
    }

    async approveCourseBYId({ lessonId, payload, courseId }, score) {
        const lesson = await Lesson.query().findById(lessonId)
                                .throwIfNotFound()
                                .catch((err) => {
                                    return { httpStatus: err.statusCode || 500, message: err.message };
                                });
        console.log(lesson);
        if (lesson.approval_score <= score) {
            await ApprovedCourses
                .query()
                .insert({
                    course_id: courseId,
                    user_id: payload.user_id,
                    score: score
                })
                .catch((err) => {
                    return { httpStatus: err.statusCode || 500, message: err.message };
                });
            return { message: '¡Course approved!' };
        } 

        return { message: 'Course not approved :(' };
    }

}

module.exports = LessonService;