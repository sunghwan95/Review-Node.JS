export const join = (req, res, next) => {
  return res.send("Join User");
};

export const login = (req, res, next) => {
  return res.send("Login");
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
