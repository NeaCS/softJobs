const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const { registroUsuario } = require("./consultas");

app.use(cors());
app.use(express.json());
app.listen(3001, () => console.log("Servidor encendido")); // Asegúrate de utilizar una función de callback aquí

app.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body;
    await registroUsuario(usuario);
    res.send("Usuario registrado");
  } catch (error) {
    res.status(500).send("Error al registrar al usuario");
  }
});
