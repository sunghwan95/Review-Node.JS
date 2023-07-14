import "./db";
import "./models/Video";
import "./models/User";
import app from "./app";

const PORT = 4000;

app.listen(PORT, console.log("Server is connecting..."));
