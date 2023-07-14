import Video from "../models/Video";

export const home = async (req, res, next) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: -1 });
    return res.render("home", { pageTitle: "Home", videos }); // pug에 변수 보내주기
  } catch {
    return res.end();
  }
};

export const watch = async (req, res, next) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (video === null) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res, next) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (video === null) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  return res.render("edit", { pageTitle: `Editing ${video.title}`, video });
};

export const postEdit = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id }); //몽고db의 id(==_id)와 파라미터로 받은 id(==id)가 일치하는지 확인
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect("/");
};

export const upload = (req, res, next) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res, next) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (err) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMsg: err._message,
    });
  }
};

export const deleteVideo = async (req, res, next) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"), //대소문자 구분없이 keyword를 포함하고있으면 모두 검색(몽고DB 기능))
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
