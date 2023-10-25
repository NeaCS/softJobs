const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "softjobs",
  password: "naldi1291",
  allowExitOnIdle: true,
});

const getUsuario = async (email, usuario) => {
  try {
    const consulta = `SELECT * FROM usuarios WHERE email = $1`;
    const values = [email];
    const { rowCount } = pool.query(consulta, values);
    return rowCount
  } catch (err) {
    console.error(err);
  }
};

module.exports(getUsuario);
