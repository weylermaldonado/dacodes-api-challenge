const { Model } = require('objection');

class Question extends Model {

    static get tableName() {
        return 'questions';
      }
    
      static get idColumn() {
        return 'question_id';
      }
    
      static get jsonSchema() {
        return {
          type: 'object',
          properties: {
            question_id: { type: 'integer' },
            question_text: { type: 'string' },
            question_type: { type: 'string' },
            answers: { type: 'string' },
          },
        };
      }
}

module.exports = Question;