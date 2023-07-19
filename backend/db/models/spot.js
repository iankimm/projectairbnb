'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.hasMany(
        models.Review,
        {foreignKey: 'spotId', onDelete: 'CASCADE'}
      ),
      Spot.hasMany(
        models.SpotImage,
        {foreignKey: 'spotId', onDelete: 'CASCADE'}
      ),
      Spot.belongsTo(
        models.User,
        {foreignKey: 'ownerId', onDelete: 'CASCADE'}
      )
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        uniqueValidate: async function (value) {
          const spot = await Spot.findOne({
            where: {
              address: value
            }
          })
          if(spot) {
            throw new Error("Address must be unique")
          }
        },
        emptyValidate(value) {
          if(value.length === 0) {
            throw new Error("Cannot be empty")
          }
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        emptyValidate(value) {
          if(value.length === 0) {
            throw new Error("Cannot be empty")
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        emptyValidate(value) {
          if(value.length === 0) {
            throw new Error("Cannot be empty")
          }
        }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        emptyValidate(value) {
          if(value.length === 0) {
            throw new Error("Cannot be empty")
          }
        }
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: -90,
        max: 90,
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [0, 50],
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
