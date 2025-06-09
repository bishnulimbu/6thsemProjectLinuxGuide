"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "experience_level", {
      type: Sequelize.ENUM("beginner", "novice", "advanced"),
      defaultValue: "beginner",
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "experience_level");
  },
};
