'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    // options.tableName = 'ReviewImages';
    // return queryInterface.bulkInsert(options, [
    //   {
    //     reviewId: 1,
    //     url: "hello url",
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   },
    //   {
    //     reviewId: 2,
    //     url: "hello url",
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   },
    //   {
    //     reviewId: 3,
    //     url: "hello url",
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   },
    // ], {});
  },

  async down (queryInterface, Sequelize) {
    // options.tableName = 'ReviewImages';
    // return queryInterface.bulkDelete(options, null, {})
  }
};
