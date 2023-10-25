const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const { getUsuario } = require("./consultas");

app.use(cors());
app.use(express.json());
app.listen(3001, console.log("servidor encendido"));

app.get("/usuarios", async (req, res) => {
  try {
    const token = req.headers.authorization;

    const elToken = token.split("Bearer ")[1];
    console.log(elToken);

    jwt.verify(elToken, "az_AZ");
    const { email } = jwt.decode(elToken);
    const emailEncontrado = await getUsuario(email, res);

    if (emailEncontrado) {
      res.status(200).json({ email: emailEncontrado });
    } else {
      res.status(404).json({ message: "Email no encontrado" });
    }
  } catch (error) {
    console.error("ERROR en la ruta /usuarios: ", error);
    res.status(error.code || 500).send(error);
  }
});
