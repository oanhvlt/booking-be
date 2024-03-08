'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    static associate(models) {
      //define association here
      Allcode.hasMany(models.User, {
        foreignKey: 'positionId', as: 'positionData'
      });
      Allcode.hasMany(models.User, {
        foreignKey: 'gender', as: 'genderData'
      });
      Allcode.hasMany(models.Schedule, {
        foreignKey: 'timeType', as: 'timeTypeData'
      });

      Allcode.hasMany(models.Doctor_Info, {
        foreignKey: 'priceId', as: 'priceData'
      });
      Allcode.hasMany(models.Doctor_Info, {
        foreignKey: 'provinceId', as: 'provinceData'
      });
      Allcode.hasMany(models.Doctor_Info, {
        foreignKey: 'paymentId', as: 'paymentData'
      });
      Allcode.hasMany(models.Booking, {
        foreignKey: 'timeType', as: 'timeTypeBooking'
      });
    }
  };
  Allcode.init({
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Allcode',
  });
  return Allcode;
};