import "dotenv/config"; // npm i dotenv
import "./db";
import "./models/Video";
import "./models/User";
import app from "./app";

const PORT = 8080;

app.listen(PORT, console.log("Server is connecting..."));
