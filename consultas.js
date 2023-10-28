const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "softjobs",
  password: "naldi1291",
  allowExitOnIdle: true,
});

const registroUsuario = async (usuario) => {
  try {
    let { email, password, rol, lenguage } = usuario;
    const passwordEncriptado = bcrypt.hashSync(password, 10); // Añade el factor de coste (saltRounds) aquí
    const consulta = "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)";
    const values = [email, passwordEncriptado, rol, lenguage];
    const { rowCount } = await pool.query(consulta, values);
    return rowCount;
  } catch (error) {
    console.error(error); // Debes registrar el error en la consola
    throw error; // Debes lanzar el error para que se maneje adecuadamente en otro lugar
  }
};

module.exports = { registroUsuario };