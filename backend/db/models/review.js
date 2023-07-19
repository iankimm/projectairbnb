'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.hasMany(
        models.ReviewImage,
        {
          foreignKey: 'reviewId',
          onDelete: "CASCADE"
        },
      )
      Review.belongsTo(
        models.User,
        {foreignKey: 'userId'}
      ),
      Review.belongsTo(
        models.Spot,
        {foreignKey: 'spotId'}
      )
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0,500],
        emptyValidate(value) {
          if(value.length === 0) {
            throw new Error("Cannot be empty")
          }
        },
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true,
        min: 1,
        max: 5,
        emptyValidate(value) {
          if(value.length === 0) {
            throw new Error("Cannot be empty")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
