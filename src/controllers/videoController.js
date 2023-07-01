export const home = (req, res, next) => {
  return res.send("Home");
};

export const watch = (req, res, next) => {
  console.log(req.params.id);
  return res.send("Watch Video");
};

export const edit = (req, res, next) => {
  return res.send("Edit vidoe");
};

export const upload = (req, res, next) => {
  return res.send("upload");
};

export const remove = (req, res, next) => {
  return res.send("remove");
};
