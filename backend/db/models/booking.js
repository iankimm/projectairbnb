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
      )
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
        startDateValidate(value) {
          if(new Date(value) < new Date()){
            throw new Error("Invalid Start Date")
          }
        },
        startEmptyValidate(value) {
          if(value === ''){
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
        endDateValidate(value) {
          if(value < this.startDate) {
            throw new Error("Invalid End Date");
          }
        },
        endEmptyValidate(value) {
          if(value === '') {
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
