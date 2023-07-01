export const home = (req, res, next) => {
  return res.send("Home");
};

export const join = (req, res, next) => {
  return res.send("Join User");
};

export const edit = (req, res, next) => {
  return res.send("Edit User");
};

export const remove = (req, res, next) => {
  return res.send("Remove User Info");
};
