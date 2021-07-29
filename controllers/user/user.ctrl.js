const { User } = require("../../models");
const jwt = require("jsonwebtoken");
const session = require("express-session");
require("dotenv").config();

/****회원가입****/
exports.register = async (req, res, next) => {
  const { id } = req.body;
  try {
    //해당 id user 존재 체크
    const user = await User.findOne({ id });
    if (user) return res.status(401).send({ err: "이미 존재하는 id 입니다." });
    //user 생성
    const newUser = new User({ ...req.body });
    await newUser.save();
    return res.send({ result: "success" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ err: err.message });
  }
};

/****로그인****/
exports.login = async (req, res, next) => {
  const { id, password } = req.body;
  try {
    const user = await User.findOne().and([{ id }, { password }]);
    if (!user)
      return res
        .status(401)
        .send({ err: "아이디 또는 패스워드가 일치하지 않습니다." });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN);
    return res.send({ result: { user: { token: token, id: user.id } } });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ err: err.message });
  }
};

/****아이디 찾기****/
exports.findUserById = async (req, res, next) => {
  const { name, item } = req.body;

  try {
    const [userByEmail, userByPhone] = await Promise.all([
      User.findOne().and([{ name }, { email: item }]),
      User.findOne().and([{ name }, { phone_number: item }]),
    ]);

    if (!userByEmail && !userByPhone)
      return res.status(401).send({ err: "회원정보를 찾을 수 없습니다." });
    if (userByEmail)
      return res.send({ result: { user: { id: userByEmail.id } } });
    if (userByPhone)
      return res.send({ result: { user: { id: userByPhone.id } } });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ err: err.message });
  }
};
