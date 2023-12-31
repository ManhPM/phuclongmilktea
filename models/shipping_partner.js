'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shipping_partner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Order, Shipper}) {
      this.hasOne(Order, { foreignKey: "id_shipping_partner" });
      this.hasOne(Shipper, { foreignKey: "id_shipping_partner" });
    }
  }
  Shipping_partner.init({
    id_shipping_partner: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    unit_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Shipping_partner',
    timestamps: false,
    underscored: true
  });
  return Shipping_partner;
};