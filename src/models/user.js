'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Allcode, {
        foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData'
      });
      User.belongsTo(models.Allcode, {
        foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData'
      });

      User.hasOne(models.Markdown, {
        foreignKey: 'doctorId'
      });
      User.hasOne(models.Doctor_Info, {
        foreignKey: 'doctorId'
      });
      // User.belongsTo(models.Schedule, {
      //   foreignKey: 'id', targetKey: 'doctorId', as: 'doctorData'
      // });
      User.hasMany(models.Schedule, {
        foreignKey: 'doctorId'
      });
      User.hasMany(models.Booking, {
        foreignKey: 'patientId'
      });
    }
  };
  User.init({
    // humanid: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    gender: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,
    image: DataTypes.TEXT,

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};