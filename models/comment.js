const { Schema, model, Types } = require("mongoose");

const CommentSchema = new Schema(
  {
    user: { type: Types.ObjectId, required: true, ref: "user" },
    goods: { type: Types.ObjectId, required: true, ref: "goods" },
    title: { type: String, required: true },
    content: { type: String, required: true },
    star_rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Comment = model("comment", CommentSchema);
module.exports = Comment;
