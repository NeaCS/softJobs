const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "softjobs",
  password: "naldi1291",
  allowExitOnIdle: true,
});

const obtenerUsuarios = async (email) => {
  try {
    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const values = [email];
    const { rows } = await pool.query(consulta, values);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const registroUsuario = async (usuario) => {
  try {
    let { email, password, rol, lenguage } = usuario;
    const passwordEncriptado = bcrypt.hashSync(password);
    const consulta =
      "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)";
    const values = [email, passwordEncriptado, rol, lenguage];
    const { rowCount } = await pool.query(consulta, values);
    return rowCount;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const verificarUsuario = async (email, password) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";

  const { rows, rowCount } = await pool.query(consulta, values);

  if (rowCount === 1) {
    const usuario = rows[0];
    const passwordEsCorrecta = bcrypt.compareSync(password, usuario.password);
    if (!passwordEsCorrecta) {
      throw new Error ("Contraseña o Usuario incorrecto");
    }
  }
};



module.exports = { registroUsuario, obtenerUsuarios, verificarUsuario };
