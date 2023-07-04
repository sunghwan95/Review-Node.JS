const testUser = {
  username: "sunghwan",
  loggedIn: false,
};

export const home = (req, res, next) => {
  const testDB = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return res.render("home", { pageTitle: "Home", testUser, testDB }); // pug에 변수 보내주기
};

export const watch = (req, res, next) => {
  res.render("watch", { pageTitle: "Watch" });
};

export const edit = (req, res, next) => {
  res.render("edit", { pageTitle: "Edit" });
};

export const upload = (req, res, next) => {
  return res.send("upload");
};

export const remove = (req, res, next) => {
  return res.send("remove");
};
