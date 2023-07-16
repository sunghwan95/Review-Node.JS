import User from "../models/User";
import bcrypt from "bcrypt";
import Video from "../models/Video";

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
      errorMsg: "비밀번호가 일치하지 않습니다.",
    });
  }

  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
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
  console.log("토큰:", tokenReq);

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
    console.log("유저정보:", userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log("이메일정보:", emailData);
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
      req.session.loggedIn = true;
      req.session.user = user;

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

export const logout = (req, res, next) => {
  req.session.destroy();

  return res.redirect("/");
};

export const getEdit = (req, res, next) => {
  return res.render("users/edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res, next) => {
  // const _id = req.session.user._id;
  // const { name, email, username } = req.body; 아래 코드와 동일
  const {
    session: {
      user: { _id, avatarUrl, email: sessionEmail, username: sessionUsername },
    },
    body: { name, email, username },
    file,
  } = req;

  let InfoToChange = [];
  if (email !== sessionEmail) {
    InfoToChange.push({ email });
  }
  if (username !== sessionUsername) {
    InfoToChange.push({ username });
  }
  if (InfoToChange.length > 0) {
    const user = await User.findOne({ $or: InfoToChange });
    if (user && user._id.toString() !== _id) {
      return res.status(404).render("users/edit-profile", {
        pageTitle: "Edit Profile",
        errMessage: "이미 존재하는 아이디(또는 메일)입니다.",
      });
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
    },
    { new: true } // data를 update한 후 update된 데이터를 리턴하도록 설정.
  );
  req.session.user = updatedUser;

  return res.redirect("/users/edit");
};

export const getChangePw = (req, res, next) => {
  if (req.session.socialOnly === true) {
    return res.redirect("/");
  }

  return res.render("users/change-pw", { pageTitle: "Change Password" });
};

export const postChangePw = async (req, res, next) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  const user = await User.findById(_id); //session에서 얻어온 유저정보를 바탕으로 바꾸려면 마지막에 session DB 업데이트x

  if (newPassword !== newPassword1) {
    return res.status(400).render("users/change-pw", {
      pageTitle: "Change Password",
      errMessage: "새 비밀번호가 일치하지 않습니다.",
    });
  }

  const checkPassword = await bcrypt.compare(oldPassword, user.password);
  if (!checkPassword) {
    return res.status(400).render("users/change-pw", {
      pageTitle: "Change Password",
      errMessage: "비밀번호가 일치하지 않습니다.",
    });
  }

  user.password = newPassword;
  await user.save();
  //req.session.user.password = user.password; //session을 통해 유저정보를 얻었으니 session DB도 업데이트

  return res.redirect("/users/logout");
};

export const see = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found" });
  }

  return res.render("users/profile", {
    pageTitle: `${user.name} Profile`,
    user,
    videos: user.videos,
  });
};
