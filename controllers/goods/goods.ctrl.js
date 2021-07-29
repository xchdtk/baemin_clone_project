const { Goods, Category, Comment, Order } = require("../../models");
const { findById } = require("../../models/user");

// 메인 페이지(모든 상품)
exports.getAllGoods = async (req, res) => {
  try {
    const goods = await Goods.find({});
    return res.send({ result: goods });
  } catch (err) {
    console.log(err);
    res.status(400).send({ err: err.message });
  }
};

// 카테고리 페이지
exports.getGoodsByCategory = async (req, res) => {
  category_name = req.query.name;
  try {
    category = await Category.findOne({
      name: category_name,
    });
    const goods = await Goods.find({ category: category._id });
    return res.send({ result: goods });
  } catch (err) {
    console.log(err);
    res.status(400).send({ err: err.message });
  }
};

// 상세 페이지
exports.getGoodsDetail = async (req, res) => {
  goodsId = req.params.goodsId;
  try {
    const goods = await Goods.findById(goodsId);
    return res.send({ result: goods });
  } catch (err) {
    console.log(err);
    res.status(400).send({ err: err.message });
  }
};

// 검색
exports.searchGoods = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const goods = await Goods.find({ title: { $regex: keyword } });
    res.status(200).send({ result: { goods } });
  } catch (err) {
    console.log(err);
    res.status(400).send({ err: err.message });
  }
};

//코멘트(상품 후기) 생성
exports.createComment = async (req, res) => {
  const { goodsId } = req.params;
  const userId = res.locals.user;
  const { title, content, star_rating } = req.body;
  try {
    const [commentCheck, buyCheck] = await Promise.all([
      Comment.findOne().and([{ user: userId }, { goods: goodsId }]),
      Order.findOne().and([{ user: userId }, { goods: goodsId }]),
    ]);
    //후기 작성 여부
    if (commentCheck)
      return res
        .status(401)
        .send({ err: "이미 해당 상품의 후기를 작성하셨습니다." });
    //해당 상품 구매여부
    if (!buyCheck)
      return res
        .status(401)
        .send({ err: "구매한 상품에 대해서만 후기 작성 가능합니다." });

    const newComment = new Comment({
      user: userId,
      goods: goodsId,
      title,
      content,
      star_rating,
    });
    //상품후기 저장 및 상품 후기 수 업데이트
    await Promise.all([
      newComment.save(),
      Goods.updateOne({ _id: goodsId }, { $inc: { comment_count: 1 } }),
    ]);
    return res.send({ result: "success" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ err: err.message });
  }
};

//코멘트(상품후기) 가져오기
exports.getComment = async (req, res) => {
  const { goodsId } = req.params;
  try {
    const comments = await Comment.find({ goods: goodsId })
      .populate("user", "id name")
      .select("user title content star_rating createdAt")
      .sort("-createdAt");
    return res.send({ result: comments });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ err: err.message });
  }
};

//코멘트(상품후기) 삭제하기
exports.deleteComment = async (req, res) => {
  //코멘트 id
  const { id } = req.body;
  //상품 id
  const { goodsId } = req.params;
  try {
    //localStorage로 인한 예외처리
    const goods = await Goods.findById(goodsId);
    if (goods.comment_count == 0)
      return res
        .status(400)
        .send({ err: "해당 상품의 후기가 존재하지 않습니다." });
    //댓글 삭제 및 댓글 갯수 수정
    await Promise.all([
      Comment.findByIdAndDelete(id),
      Goods.findByIdAndUpdate(goodsId, { $inc: { comment_count: -1 } }),
    ]);
    return res.send({ result: "success" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ err: err.message });
  }
};
