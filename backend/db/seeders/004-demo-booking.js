'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    // options.tableName = 'Bookings';
    // return queryInterface.bulkInsert(options, [
    //   {
    //     spotId: 1,
    //     userId: 2,
    //     startDate: "2023-11-19T00:00:00.000Z",
    //     endDate: "2023-11-20T00:00:00.000Z",
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   },
    //   {
    //     spotId: 2,
    //     userId: 3,
    //     startDate: "2023-11-19T00:00:00.000Z",
    //     endDate: "2023-11-20T00:00:00.000Z",
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   },
    //   {
    //     spotId: 3,
    //     userId: 1,
    //     startDate: "2023-11-19T00:00:00.000Z",
    //     endDate: "2023-11-20T00:00:00.000Z",
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   },
    // ], {});
  },

  async down (queryInterface, Sequelize) {
    // options.tableName = 'Bookings';
    // return queryInterface.bulkDelete(options, null, {})
  }
};
