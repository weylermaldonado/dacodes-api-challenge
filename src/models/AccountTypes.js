const { Model } = require('objection');

class AccountType extends Model {

    static get tableName() {
        return 'account_types';
      }
    
      static get idColumn() {
        return 'account_type_id';
      }
    
      static get jsonSchema() {
        return {
          type: 'object',
          properties: {
            account_type_id: { type: 'integer' },
            account_name: { type: 'string' }
          },
        };
      }
}

module.exports = AccountType;