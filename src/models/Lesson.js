const { Model } = require('objection');

class Lesson extends Model {
    static get tableName() {
        return 'lessons';
    }
    
      static get idColumn() {
        return 'lesson_id';
    }
    
      static get jsonSchema() {
        return {
          type: 'object',
          properties: {
            lesson_id: { type: 'integer' },
            details: { type: 'string' },
            approval_score: { type: 'integer' }
          },
        };
      }

      static get relationMappings() {
        const Question = require('../models/Question.js');
        return {
          questions: {
            relation: Model.ManyToManyRelation,
            modelClass: Question,
            join: {
              from: 'lessons.lesson_id',
              through: {
                from: 'course_lesson_question.lesson_id',
                to: 'course_lesson_question.question_id'
              },
              to: 'questions.question_id'
            }
          }
        }
      }
}

module.exports = Lesson;