'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('foods', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM(
          'frutos-do-mar',
          'sementes',
          'vegetais',
          'graos',
          'paes',
          'legumes',
          'laticinios',
          'gordura'
        ),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      calories: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lipids: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('foods');
  },
};
