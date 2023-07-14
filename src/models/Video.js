import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,
  createdAt: { type: Date, default: Date.now }, //비디오를 생성할 때만 Date.now 함수 실행
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
});

//db에 Video모델을 저장(.save())하거나 생성하기(.create())전에 전에 해쉬태그를 작업해주는 middleware
//Video 모델을 통해 전역(static)으로 쓸 수 있는 메소드
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

/*
videoSchema.pre("save", function (hashtags) {
  this.hashtags = this.hashtags[0]
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});
*/

const Video = mongoose.model("Video", videoSchema);
export default Video;
