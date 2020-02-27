const { Model } = require('objection');

class CourseLessonQuestion extends Model {
    static get tableName() {
        return 'course_lesson_question';
    }
    
      static get idColumn() {
        return 'course_lesson_question_id';
    }
    
      static get jsonSchema() {
        return {
          type: 'object',
          properties: {
            course_lesson_question_id: { type: 'integer' },
            course_id: { type: 'integer' },
            lesson_id: { type: 'integer' },
            question_id: { type: 'integer' },
          },
        };
      }
}

module.exports = CourseLessonQuestion;