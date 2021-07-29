const { User, Goods, Order } = require("../../models");

// 주문
exports.order_post = async (req, res) => {
  try {
    const {
      goods,
      quantity,
      address_one,
      address_two,
      zipcode,
      delivery_comment,
      payment_method,
    } = req.body;
    let { phone_number } = req.body;

    if (phone_number.includes("-")) {
      phone_number = phone_number.split("-");
      phone_number = phone_number.join("");
    }

    await Order.create({
      user: res.locals.user,
      goods: goods,
      quantity: quantity,
      address_one: address_one,
      address_two: address_two,
      zipcode: zipcode,
      delivery_comment: delivery_comment,
      phone_number: phone_number,
      payment_method: payment_method,
    });
    res.status(200).send({ result: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ result: "fail" });
  }
};

//마아페이지 주문내역
exports.getMyOrder = async (req, res) => {
  const userId = res.locals.user;
  try {
    orders = await Order.find({ user: userId })
      .populate("user", "id name")
      .populate("goods", "title sale_price option thumbnail_url")
      .select("user goods quantity createdAt")
      .sort("-createdAt");
    res.status(200).send({ result: orders });
  } catch (err) {
    console.log(err);
    res.status(400).send({ err: err.message });
  }
};
