'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Export_invoice_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Export_invoice, Unprocessed_ingredient}) {
      this.belongsTo(Export_invoice, { foreignKey: "id_e_invoice" });
      this.belongsTo(Unprocessed_ingredient, { foreignKey: "id_u_ingredient" });
    }
  }
  Export_invoice_detail.init({
    id_e_invoice: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_u_ingredient: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    quantity: DataTypes.INTEGER,
    unit_price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Export_invoice_detail',
    timestamps: false,
    underscored: true
  });
  return Export_invoice_detail;
};