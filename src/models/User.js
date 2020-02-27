const { Model } = require('objection');

class User extends Model {

    static get tableName() {
        return 'users';
    }
    
      static get idColumn() {
        return 'user_id';
    }
    
      static get jsonSchema() {
        return {
          type: 'object',
          properties: {
            user_id: { type: 'integer' },
            user_name: { type: 'string' },
            user_email: { type: 'string' },
            user_password: { type: 'string' },
            account_type_id: { type: 'integer' }
          },
        };
      }

      static get relationMappings() {
          const AccountType = require('./AccountTypes.js');
          const Course = require('./Course.js');

          return {
              accountTypes: {
                  relation: Model.HasOneRelation,
                  modelClass: AccountType,
                  join: {
                      from: 'users.account_type_id',
                      to: 'account_types.account_type_id'
                  }
              },
              courses: {
                  relation: Model.ManyToManyRelation,
                  modelClass: Course,
                  join: {
                      from: 'users.user_id',
                      through: {
                          from: 'user_courses.user_id',
                          to: 'user_courses.course_id'
                      },
                      to: 'courses.course_id'
                  }
              }
          }
      }
}

module.exports = User;