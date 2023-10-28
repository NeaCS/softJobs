const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const { registroUsuario, obtenerUsuarios, verificarUsuario } = require("./consultas");

app.use(cors());
app.use(express.json());
app.listen(3001, console.log("Servidor encendido")); 

app.get("/usuarios", async (req, res) => {
  try {
    const token = req.headers.authorization
    const tokenSplit = token.split("Bearer ")[1];
    console.log(jwt.verify(tokenSplit, "az_AZ"))
    jwt.verify(tokenSplit, "az_AZ");
    const {email} = jwt.decode(tokenSplit)
    const buscarUsuario = await obtenerUsuarios(email);
    if (buscarUsuario) {
      res.send(buscarUsuario[0]);
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (err) {
    res.status(500).send('Error al obtener los usuarios');
  }
})

app.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body;
    await registroUsuario(usuario);
    res.send("Usuario registrado");
  } catch (error) {
    res.status(500).send("Error al registrar al usuario");
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarUsuario(email, password);
    const token = jwt.sign({ email }, "az_AZ");
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(500).send("Usuario o contraseña inválidos");
  }
});


