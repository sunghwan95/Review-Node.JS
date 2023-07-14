import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); // pug폴더 경로 설정

app.use(morgan("dev")); // morgan middleware
// HTML form으로 주고 받는 데이터들을 JS객체 형태로 변환시켜 application이 이해하도록 함.
app.use(express.urlencoded({ extended: true }));

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
