import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); // pug폴더 경로 설정

app.use(morgan("dev")); // morgan middleware
// HTML form으로 주고 받는 데이터들을 JS객체 형태로 변환시켜 application이 이해하도록 함.
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false, //로그인한 유저에게만 쿠키 부여 -> db에 세션 저장.
    saveUninitialized: false, //세션이 초기화 될 때만 db에 세션 저장.
    cookie: {
      maxAge: 8.64e7,
    },
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);

app.use((req, res, next) => {
  req.sessionStore.all((err, sessions) => {
    console.log("모든 세션의 정보:", sessions);
    next();
  });
});

app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
