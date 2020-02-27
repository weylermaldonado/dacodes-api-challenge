const { Model } = require('objection');

class ApprovedCourses extends Model {

    static get tableName() {
        return 'approved_courses';
      }
    
      static get idColumn() {
        return 'approved_course_id';
      }
    
      static get jsonSchema() {
        return {
          type: 'object',
          properties: {
            approved_course_id: { type: 'integer' },
            user_id: { type: 'integer' },
            course_id: { type: 'integer' },
            score: { type: 'integer' },
            created_at: { type: 'integer' }
          },
        };
      }

      async $beforeInsert(contextQuery) {
          await super.$beforeInsert(contextQuery);
          this.created_at =  new Date().toISOString().replace('T', ' ').replace('Z', '');
      }
   

}

module.exports = ApprovedCourses;