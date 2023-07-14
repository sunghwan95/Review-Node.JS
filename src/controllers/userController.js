import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res, next) => {
  return res.render("join", { pageTitle: "회원 가입" });
};

export const postJoin = async (req, res, next) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errMessage: "비밀번호가 일치하지 않습니다.",
    });
  }
  const userExists = await User.exists({ $or: [{ username }, { email }] }); //username이나 email 둘 중 하나라도 존재한다면 true 반환.
  if (userExists) {
    return res.status(400).render("join", {
      pageTitle,
      errMessage: "존재하는 계정 입니다.",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (err) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errMessage: err._message,
    });
  }
};

export const getLogin = (req, res, next) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errMessage: "해당 유저가 존재하지 않습니다.",
    });
  }
  const verify = await bcrypt.compare(password, user.password);
  if (!verify) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errMessage: "비밀번호가 일치하지 않습니다.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const logout = (req, res, next) => {
  return res.send("logout");
};

export const search = (req, res, next) => {
  return res.send("search");
};

export const edit = (req, res, next) => {
  return res.send("Edit User");
};

export const remove = (req, res, next) => {
  return res.send("Remove User Info");
};

export const see = (req, res, next) => {
  return res.send("see");
};
