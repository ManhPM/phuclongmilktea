'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Unprocessed_ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Import_invoice_detail, Export_invoice_detail, Recipe_ingredient, Store}) {
      this.hasOne(Import_invoice_detail, { foreignKey: "id_u_ingredient" });
      this.hasOne(Export_invoice_detail, { foreignKey: "id_u_ingredient" });
      this.hasOne(Recipe_ingredient, { foreignKey: "id_u_ingredient" });
      this.belongsTo(Store, { foreignKey: "id_store" });
      // define association here
    }
  }
  Unprocessed_ingredient.init({
    id_u_ingredient: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    unit: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Unprocessed_ingredient',
    timestamps: false
  });
  return Unprocessed_ingredient;
};