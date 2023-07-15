import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

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
  const user = await User.findOne({ username, socialOnly: false });
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

export const edit = (req, res, next) => {};

export const logout = (req, res, next) => {
  req.session.destroy();
  return res.redirect("/");
};

export const see = (req, res, next) => {
  return res.send("see");
};

export const startGithubLogin = (req, res, next) => {
  const base_url = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: "b129c60018eaa028236a",
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const final_url = `${base_url}?${params}`;
  return res.redirect(final_url);
};

export const endGithubLogin = async (req, res, next) => {
  const base_url = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: "b129c60018eaa028236a",
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const final_url = `${base_url}?${params}`;

  const tokenReq = await (
    await fetch(final_url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenReq) {
    const { access_token } = tokenReq;
    const apiUrl = "https:///api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }

    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        name: userData.name,
        avatarUrl: userData.avatar_url,
        socialOnly: true,
        username: userData.login,
        email: emailObj.email,
        password: "",
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    } else {
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
  /*
  fetch(final_url, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((tokenReq) => {
      if ("access_token" in tokenReq) {
        const { access_token } = tokenReq;
        const apiUrl = "https:///api.github.com";

        fetch(`${apiUrl}/user`, {
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
          .then((response) => response.json())
          .then((userData) => {
            // Process userData here
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });

        fetch(`${apiUrl}/user/emails`, {
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
          .then((response) => response.json())
          .then((emailData) => {
            // Process emailData here
          })
          .catch((error) => {
            console.error("Error fetching email data:", error);
          });
      } else {
        res.redirect("/login");
      }
    })
    .catch((error) => {
      console.error("Error fetching token:", error);
    });
  */
};
