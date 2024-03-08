'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{//bulkInsert: tạo nhiều record vào DB
      email: 'admin@dev.com',
      password: '123456',
      firstName: 'Admin',
      lastName: 'HDIT',
      address: 'VN',
      gender: 1,
      roleId: "1",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
