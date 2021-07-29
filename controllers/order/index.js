const { Router } = require("express");
const router = Router();
const ctrl = require("./order.ctrl");
const validation = require("../../middlewares/validation");

// 주문하기
router.post("/", validation, ctrl.order_post);
// 주문 내역
router.get("/", validation, ctrl.getMyOrder);

module.exports = router;
