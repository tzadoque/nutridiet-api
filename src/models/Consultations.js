const { Model, DataTypes } = require('sequelize');

class Consultations extends Model {
  static init(connection) {
    super.init(
      {
        paciente_id: DataTypes.INTEGER,
        nutricionista_id: DataTypes.INTEGER,
        paciente_name: DataTypes.STRING,
        date: DataTypes.DATEONLY,
        hour: DataTypes.TIME,
      },
      {
        sequelize: connection,
        tableName: 'consultations',
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      }
    );
  }
}

module.exports = Consultations;
