const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const {
  registroUsuario,
  obtenerUsuarios,
  verificarUsuario,
} = require("./consultas");

app.use(cors());
app.use(express.json());
app.listen(3001, console.log("Servidor encendido"));

// middlewares
const verificarCredenciales = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Faltan credenciales");
  }
  next();
};

const validarToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Token no proporcionado");
  } else {
    try {
      const tokenSplit = token.split("Bearer ")[1];
      jwt.verify(tokenSplit, "az_AZ");
      next();
    } catch (error) {
      return res.status(401).send("Token no válido");
    }
  }
};

const reportarConsultas = (req, res, next) => {
  console.log(`Consulta recibida en la ruta: ${req.originalUrl}`);
  next();
};

app.get("/usuarios", reportarConsultas, validarToken, async (req, res) => {
  try {
    const token = req.headers.authorization;
    const tokenSplit = token.split("Bearer ")[1];
    console.log(jwt.verify(tokenSplit, "az_AZ"));
    jwt.verify(tokenSplit, "az_AZ");
    const { email } = jwt.decode(tokenSplit);
    const buscarUsuario = await obtenerUsuarios(email);
    if (buscarUsuario) {
      res.send(buscarUsuario[0]);
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (err) {
    res.status(500).send("Error al obtener los usuarios");
  }
});

app.post("/usuarios", reportarConsultas, async (req, res) => {
  try {
    const usuario = req.body;
    await registroUsuario(usuario);
    res.send("Usuario registrado");
  } catch (error) {
    res.status(500).send("Error al registrar al usuario");
  }
});

app.post(
  "/login",
  reportarConsultas,
  verificarCredenciales,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      await verificarUsuario(email, password);
      const token = jwt.sign({ email }, "az_AZ");
      res.send(token);
    } catch (error) {
      console.log(error);
      res.status(500).send("Usuario o contraseña inválidos");
    }
  }
);
