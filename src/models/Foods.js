const { Model, DataTypes } = require('sequelize');

class Foods extends Model {
  static init(connection) {
    super.init(
      {
        name: DataTypes.STRING,
        type: DataTypes.ENUM(
          'frutos-do-mar',
          'sementes',
          'vegetais',
          'graos',
          'paes',
          'legumes',
          'laticinios',
          'gordura'
        ),
        calories: DataTypes.STRING,
        lipids: DataTypes.STRING,
      },
      {
        sequelize: connection,
        tableName: 'foods',
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      }
    );
  }
}

module.exports = Foods;
