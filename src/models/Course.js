const { Model } = require('objection');

class Course extends Model {

    static get tableName() {
        return 'courses';
      }
    
      static get idColumn() {
        return 'course_id';
      }
    
      static get jsonSchema() {
        return {
          type: 'object',
          properties: {
            course_id: { type: 'integer' },
            course_name: { type: 'string' },
            course_description: { type: 'string' },
            course_type: { type: 'string' },
            aprroved: { type: 'integer' }
          },
        };
      }

      static get relationMappings() {
        const Lesson = require('./Lesson.js');

        return {
          lessons: {
            relation: Model.ManyToManyRelation,
            modelClass: Lesson,
            join: {
              from: 'courses.course_id',
              through: {
                from: 'course_lesson_question.course_id',
                to: 'course_lesson_question.lesson_id'
              },
              to: 'lessons.lesson_id'
            }
          }
        };
      }

}

module.exports = Course;