const { Model, DataTypes } = require('sequelize');

class Users extends Model {
  static init(connection) {
    super.init(
      {
        name: DataTypes.STRING,
        role: DataTypes.ENUM('administrador', 'nutricionista', 'paciente'),
        email: DataTypes.STRING,
        phone_number: DataTypes.STRING,
        cpf: DataTypes.STRING,
        password: DataTypes.STRING,
        birth_date: DataTypes.STRING,
        gender: DataTypes.STRING,
        ethnic_group: DataTypes.STRING,
        crn_number: DataTypes.STRING,
        specialty: DataTypes.ENUM('nutricao-clinica', 'nutricao-esportiva'),
      },
      {
        sequelize: connection,
        tableName: 'users',
        defaultScope: {
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
          },
        },
        scopes: {
          withPassword: {
            attributes: {},
          },
        },
      }
    );
  }

  static associate(models) {
    this.hasOne(models.Addresses, {
      foreignKey: 'user_id',
      as: 'addresses',
    });
  }
}

module.exports = Users;
