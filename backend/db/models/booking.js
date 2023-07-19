'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(
        models.User,
        {foreignKey: 'userId'}
      ),
      Booking.belongsTo(
        models.Spot,
        {foreignKey: 'spotId'}
      )
    }
  }
  Booking.init({
    spotId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATE,
      validate: {
        isDate: true,
        isInt: false,
        startDateValidate(value) {
          if(new Date(value) <= new Date()){
            throw new Error("Start date must be after today!")
          }
        },
        startEmptyValidate(value) {
          if(value.length === 0){
            throw new Error("Cannot be empty");
          }
        }
      }
    },
    endDate: {
      allowNull: false,
      type: DataTypes.DATE,
      validate: {
        isDate: true,
        isInt: false,
        endDateValidate(value) {
          if(value <= this.startDate) {
            throw new Error("End date must be after start date!");
          }
        },
        endEmptyValidate(value) {
          if(value.length === 0) {
            throw new Error("Cannot be empty")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
