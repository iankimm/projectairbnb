'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 2,
        address: "777 Demo St",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 20.3434,
        lng: -110.4730327,
        name: "Demo Land",
        description: "For Ian's Demo",
        price: 777,
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        ownerId: 3,
        address: "14243 Casino St",
        city: "Dallas",
        state: "Texas",
        country: "United States of America",
        lat: 30.7345358,
        lng: -100.4730327,
        name: "Casino",
        description: "Need Money",
        price: 666,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['123 Disney Lane', '777 Demo St', '14243 Casino St'] }
    }, {});
  }
};
