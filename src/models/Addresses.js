const { Model, DataTypes } = require('sequelize');

class Addresses extends Model {
  static init(connection) {
    super.init(
      {
        zipcode: DataTypes.STRING,
        street: DataTypes.STRING,
        number: DataTypes.INTEGER,
        state: DataTypes.STRING,
        country: DataTypes.STRING,
        complement: DataTypes.STRING,
      },
      {
        sequelize: connection,
        tableName: 'addresses',
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'owner',
    });
  }
}

module.exports = Addresses;
