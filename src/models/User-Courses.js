const { Model } = require('objection');

class UserCourses extends Model {

    static get tableName() {
        return 'user_courses';
      }
    
      static get idColumn() {
        return 'user_course_id';
      }
    
      static get jsonSchema() {
        return {
          type: 'object',
          properties: {
            user_course_id: { type: 'integer' },
            user_id: { type: 'integer' },
            course_id: { type: 'string' }
          },
        };
      }
}

module.exports = UserCourses;