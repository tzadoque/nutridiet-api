module.exports = {
  dialect: 'sqlite',
  storage: 'src/database/db.sqlite',

  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
};

// Postgres config

// username: 'postgres',
// password: 'root',
// dialect: 'postgres',
// host: '127.0.0.1',
// port: '5432',
// database: 'nutridiet',

// define: {
//   timestamps: true,
//   underscored: true,
//   freezeTableName: true,
// },
