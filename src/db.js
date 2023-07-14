import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/review-node");

const db = mongoose.connection;

db.on("error", (error) => console.log("DB Error", error)); // 여러번 실행 가능
db.once("open", () => console.log("Connected DB...")); // 한번만 실행
