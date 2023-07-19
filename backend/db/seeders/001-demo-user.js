'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      // {
      //   email: 'demo@user.ios',
      //   username: 'Demo-litions',
      //   firstName: 'Ianas',
      //   lastName: 'Kimas',
      //   hashedPassword: bcrypt.hashSync('password')
      // },
      // {
      //   email: 'user1@user.ios',
      //   username: 'FakeUser1s',
      //   firstName: 'Ianass',
      //   lastName: 'Kimass',
      //   hashedPassword: bcrypt.hashSync('password2')
      // },
      // {
      //   email: 'user2@user.ios',
      //   username: 'FakeUser2s',
      //   firstName: 'Ianers',
      //   lastName: 'Kimers',
      //   hashedPassword: bcrypt.hashSync('password3')
      // }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
