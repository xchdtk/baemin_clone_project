const { Router } = require("express");
const { User } = require("../../models");
const router = Router();
const ctrl = require("./user.ctrl");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("../../passport");
require("dotenv").config();
passportConfig(passport);

//회원가입
router.post("/register", ctrl.register);
//로그인
router.post("/login", ctrl.login);
//아이디 찾기
router.post("/id", ctrl.findUserById);

//카카오 로그인 요청
router.get("/kakao", passport.authenticate("kakao"));
//카카오 로그인 콜백
router.get("/kakao/callback", (req, res) => {
  passport.authenticate("kakao", { failureRedirect: "/" }, (err, user) => {
    const { _id } = user;
    return res.redirect("http://13.125.248.86/kakao_social/" + _id);
  })(req, res);
});
//카카오 로그인 토큰 처리
router.get("/me", async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id);
  const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN);
  return res.send({ result: { user: { token: token, id: user.id } } });
});

module.exports = router;
