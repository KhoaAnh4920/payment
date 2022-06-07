// user.service.js
const db = require("../app.module");
const Order = db.order;
const Supplier = db.supplier;
const Product = db.product;
const Settings = db.settings;

const crypto = require("crypto");
const https = require("https");
const area = require("./areaJson");
const Sequelize = require("sequelize");

//https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//parameters
var partnerCode = "MOMO";
var accessKey = "F8BBA842ECF85";
var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
var orderInfo = "pay with MoMo";
var redirectUrl = "https://vuarausach.vn";

// var ipnUrl = "https://57ce-2402-800-6371-a14a-ed0d-ccd6-cbe9-5ced.ngrok.io/api/handle-order";

var notifyUrl = "https://8272-115-73-215-16.ap.ngrok.io/api/handle-order";
// var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
var requestType = "captureWallet";


// Update status order //
exports.handleOrderPayment = async (req) => {
  console.log("Check order: ", req.body);
  if (req.body.resultCode == 0) {
    // req.body.extraData = "285";
    const orderCurrent = await Order.findOne({
      where: { id: req.body.extraData },
    });
    const orderCurrentData = orderCurrent.dataValues;
    console.log("orderCurrentData dataValues: ", orderCurrentData);
    orderCurrentData.status = 2;

    const result = await Order.update(orderCurrentData, {
      where: { id: req.body.extraData },
      returning: true,
      plain: true,
    });
    // console.log(result);
    return result;
  }
  return false;
};


exports.getListStatusByOrderIds = async (req) => {
  // console.log(req.body.orderIds);
  const listOrders = await Order.findAll({
    where: { id: { [Sequelize.Op.in]: req.body.orderIds } },
  });

  return listOrders;
};

exports.handleCallbackOrderStatus = async (req) => {
  const orderCurrent = await Order.findOne({
    where: { labelGHTK: req.body.label_id },
  });
  const orderCurrentData = orderCurrent.dataValues;
  orderCurrentData.orderStatusGHTK = req.body.status_id;

  const result = await Order.update(orderCurrentData, {
    where: { labelGHTK: req.body.label_id },
    returning: true,
    plain: true,
  });
  console.log(result);
  return result;
};

exports.cancelCodeShipping = async (req, response) => {
  const orderCurrent = await Order.findOne({
    where: { id: req.body.id },
  });
  const orderCurrentData = orderCurrent.dataValues;

  if (!orderCurrentData.labelGHTK)
    throw { message: "Đơn hàng này chưa được gửi sang đơn vị vận chuyển." };
  const options = {
    hostname: "services.ghtklab.com",
    path: "/services/shipment/cancel/" + orderCurrentData.labelGHTK,
    method: "POST",
    headers: {
      Token: "312553FC8ab5bD6a5bfE77eeF3FB7E53Fb2D7013",
    },
  };
  const order_id = req.body.id;
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.on("data", async (body) => {
        const returnBody = JSON.parse(body);
        if (returnBody.success) {
          orderCurrentData.labelGHTK = "";
          orderCurrentData.orderStatusGHTK = 1;

          const result = await Order.update(orderCurrentData, {
            where: { id: order_id },
            returning: true,
            plain: true,
          });
        }
        resolve(returnBody);
      });
      res.on("end", () => { });
    });

    req.on("error", (e) => {
      // console.log(`problem with request: ${e.message}`);
    });
    // write data to request body
    // console.log("Sending....");
    req.end();
  });
};

// Print code order
exports.printCodeShipping = async (req, response) => {
  const orderCurrent = await Order.findOne({
    where: { id: req.body.id },
  });
  const orderCurrentData = orderCurrent.dataValues;
  if (!orderCurrentData.labelGHTK)
    throw { message: "Đơn hàng này chưa được gửi sang đơn vị vận chuyển." };
  const options = {
    hostname: "services.ghtklab.com",
    path: "/services/label/" + orderCurrentData.labelGHTK,
    method: "GET",
    headers: {
      Token: "312553FC8ab5bD6a5bfE77eeF3FB7E53Fb2D7013",
    },
  };

  return new Promise((resolve, reject) => {
    var chunks = [];

    const req = https.request(options, (res) => {
      res.on("data", (body) => {
        chunks.push(body);
      });
      res.on("end", () => {
        // console.log("downloaded");
        var jsfile = new Buffer.concat(chunks);
        // console.log("converted to base64");
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "X-Requested-With");
        response.header("content-type", "application/pdf");
        response.send(jsfile);
      });
    });

    req.on("error", (e) => {
      // console.log(`problem with request: ${e.message}`);
    });
    // write data to request body
    // console.log("Sending....");
    req.end();
  });
};

exports.handleCreateOrderShipping = async (req) => {
  const order_id = req.body.id;
  const orderCurrent = await Order.findOne({
    where: { id: order_id },
  });

  const orderCurrentData = orderCurrent.dataValues;
  if (orderCurrentData.labelGHTK) {
    throw { message: "Đơn hàng này đã được chuyển qua đơn vị vận chuyển." };
  }

  const supplierInfo = await Supplier.findOne({
    where: { id: req.body.supplier },
  });
  // const supplierEmail = supplierInfo.email;
  const supplierPhone = supplierInfo.phone_number;
  const supplierAddress = supplierInfo.address;
  const supplierCityItem = area.filter(
    (x) => x.codename === supplierInfo.cityCode
  )[0];

  const supplierCity = supplierCityItem.name;
  const supplierDistrictItem = supplierCityItem.districts.filter(
    (x) => x.codename === supplierInfo.districtCode
  )[0];
  const supplierDistrict = supplierDistrictItem.name;

  const supplierWard = supplierDistrictItem.wards.filter(
    (x) => x.codename === supplierInfo.wardCode
  )[0].name;

  const customerCityItem =
    area.filter((x) => x.codename === req.body.cityCode)[0] ||
    area.filter((x) => x.codename === "thanh_pho_ho_chi_minh")[0];

  const customerCity = customerCityItem.name;
  const customerDistrictItem =
    customerCityItem &&
    customerCityItem.districts.filter(
      (x) => x.codename === req.body.districtCode
    )[0];

  const customerDistrict = customerDistrictItem && customerDistrictItem.name;

  const customerWard =
    customerDistrictItem &&
    customerDistrictItem.wards.filter(
      (x) => x.codename === req.body.wardCode
    )[0].name;

  let products = [];
  for (let i = 0; i < req.body.items.length; i++) {
    const currentProduct = await Product.findOne({
      where: { id: req.body.items[i].productId },
    });
    let prefixNumber = 1;
    if (currentProduct.unit === "g") {
      prefixNumber = 0.001;
    } else if (currentProduct.unit === "tons") {
      prefixNumber = 1000;
    } else if (currentProduct.unit === "quintal") {
      prefixNumber = 100;
    } else if (currentProduct.unit === "stone") {
      prefixNumber = 10;
    }
    products.push({
      name: req.body.items[i].productName,
      weight: req.body.items[i].quantity * prefixNumber,
      quantity: req.body.items[i].quantity,
      product_code: req.body.items[i].productId,
    });
  }
  const requestBody = JSON.stringify({
    products: products,
    order: {
      id: "VRS" + req.body.orderCode + "_" + new Date().valueOf(),
      pick_name: `GHT-${supplierCity}`,
      pick_address: supplierAddress,
      pick_province: supplierCity,
      pick_district: supplierDistrict,
      pick_ward: supplierWard,
      pick_tel: supplierPhone,
      tel: req.body.phoneNumber,
      name: `GHTK - ${customerCity}`,
      address: req.body.address,
      province: customerCity,
      district: customerDistrict,
      ward: customerWard,
      hamlet: "Khác",
      is_freeship: "1",
      pick_date: new Date(),
      pick_money: req.body.totalValue,
      value: req.body.totalValue,
    },
  });

  console.log("Check requestBody: ", requestBody);

  const options = {
    hostname: "services.ghtklab.com",
    path: "/services/shipment/order/?ver=1.5",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
      Token: "312553FC8ab5bD6a5bfE77eeF3FB7E53Fb2D7013",
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding("utf8");
      res.on("data", async (body) => {
        // console.log("body", body);
        const returnBody = JSON.parse(body);
        if (returnBody.success) {
          orderCurrentData.labelGHTK = returnBody.order.label;
          orderCurrentData.orderStatusGHTK = returnBody.order.status_id;

          const result = await Order.update(orderCurrentData, {
            where: { id: order_id },
            returning: true,
            plain: true,
          });
        }

        resolve(returnBody);
      });
      res.on("end", () => {
        // console.log("No more data in response.");
      });
    });

    req.on("error", (e) => {
      // console.log(`problem with request: ${e.message}`);
    });
    // write data to request body
    // console.log("Sending....");
    req.write(requestBody);
    req.end();
  });
};

/**
 * This function end single call
 * @returns {Promise<void>}
 * @param req
 */
exports.getMomoPaymentLink = async (req) => {
  var requestId = partnerCode + new Date().getTime();
  var orderId = requestId;
  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    req.body.amount +
    "&extraData=" +
    req.body.orderId +
    "&ipnUrl=" +
    notifyUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //puts raw signature
  //console.log("--------------------RAW SIGNATURE----------------");
  console.log('rawSignature: ', rawSignature);
  //signature
  var signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");
  //console.log("--------------------SIGNATURE----------------");
  console.log('signature: ', signature);
  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: req.body.amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: notifyUrl,
    extraData: req.body.orderId,
    requestType: requestType,
    signature: signature,
    lang: "en",
  });

  const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };



  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers)}`);
      res.setEncoding("utf8");
      res.on("data", (body) => {
        console.log("Body: ");
        console.log(body);
        console.log("payUrl: ");
        console.log(JSON.parse(body).payUrl);
        resolve(JSON.parse(body));
      });
      res.on("end", () => {
        console.log("No more data in response.");
        // var post_req = https.request(options2, function (res) {
        //   res.setEncoding('utf8');
        //   res.on('data', function (chunk) {
        //     console.log('Response: ' + chunk);
        //   });
        // });
        // // post the data
        // post_req.write(requestBody);
        // post_req.end();
      });
    });

    req.on("error", (e) => {
      // console.log(`problem with request: ${e.message}`);

    });
    // write data to request body
    console.log("Sending....");

    req.write(requestBody);
    req.end();
  });
};

exports.getDashboards = async (req) => {
  var date = new Date();
  var firstDayInMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  var firstDayInYear = new Date(date.getFullYear(), 0, 1);
  //section supplier
  const supplierCount = await Supplier.count({});
  const supplierCountInYear = await Supplier.count({
    where: {
      created_at: {
        [Sequelize.Op.gte]: firstDayInYear,
      },
    },
  });
  const supplierCountInMonth = await Supplier.count({
    where: {
      created_at: {
        [Sequelize.Op.gte]: firstDayInMonth,
      },
    },
  });

  //section order
  const orderCount = await Order.count({
    where: {
      [Sequelize.Op.or]: [{ status: 6 }, { status: 7 }, { status: 8 }],
    },
  });
  const orderCountInYear = await Order.count({
    where: {
      created_at: {
        [Sequelize.Op.gte]: firstDayInYear,
      },
      [Sequelize.Op.or]: [{ status: 6 }, { status: 7 }, { status: 8 }],
    },
  });
  const orderSuccessCount = await Order.count({
    where: {
      [Sequelize.Op.or]: [{ status: 6 }, { status: 7 }],
    },
  });
  const orderSuccessCountInYear = await Order.count({
    where: {
      [Sequelize.Op.or]: [{ status: 6 }, { status: 7 }],
      created_at: {
        [Sequelize.Op.gte]: firstDayInYear,
      },
    },
  });

  const orderCancelCount = await Order.count({ where: { status: 8 } });
  const orderCancelCountInYear = await Order.count({
    where: {
      status: 8,
      created_at: {
        [Sequelize.Op.gte]: firstDayInYear,
      },
    },
  });

  const orderMoneySum = await Order.findAll({
    where: {
      [Sequelize.Op.or]: [{ status: 6 }, { status: 7 }],
    },
    attributes: [
      [Sequelize.fn("sum", Sequelize.col("total_value")), "total_value"],
    ],
    raw: true,
  });
  const orderMoneySumInYear = await Order.findAll({
    where: {
      [Sequelize.Op.or]: [{ status: 6 }, { status: 7 }],
      created_at: {
        [Sequelize.Op.gte]: firstDayInYear,
      },
    },
    attributes: [
      [Sequelize.fn("sum", Sequelize.col("total_value")), "total_value"],
    ],
    raw: true,
  });

  //section product
  const productCount = await Product.count({});
  const productCountInYear = await Product.count({
    where: {
      created_at: {
        [Sequelize.Op.gte]: firstDayInYear,
      },
    },
  });
  const productCountInMonth = await Product.count({
    where: {
      created_at: {
        [Sequelize.Op.gte]: firstDayInMonth,
      },
    },
  });

  //section access number
  const numberAccessSetting = await Settings.findOne({
    where: { key: "access_home_page" },
  });
  let numberAccess = 0;
  if (numberAccessSetting && numberAccessSetting.dataValues)
    numberAccess = numberAccessSetting.dataValues.value;

  return {
    productCount,
    productCountInYear,
    productCountInMonth,
    supplierCount,
    supplierCountInYear,
    supplierCountInMonth,
    orderCount,
    orderCountInYear,
    orderSuccessCount,
    orderSuccessCountInYear,
    orderCancelCount,
    orderCancelCountInYear,
    orderMoneySum,
    orderMoneySumInYear,
    // TODO: implement for total
    numberAccess: Number(numberAccess).valueOf() + 1234,
    numberAccessInYear: numberAccess,
  };
};

exports.updateNumberOfAccess = async (req) => {
  const numberAccess = await Settings.findOne({
    where: { key: "access_home_page" },
  });
  if (!numberAccess) {
    const result = await Settings.create({
      key: "access_home_page",
      value: "1",
    });
    return result;
  } else {
    const numberAccessValue = numberAccess.dataValues;
    if (!numberAccessValue) {
      const result = await Settings.create({
        key: "access_home_page",
        value: "1",
      });
      return result;
    }
    try {
      numberAccessValue.value = parseInt(numberAccessValue.value) + 1;
      const result = await Settings.update(numberAccessValue, {
        where: { key: `access_home_page` },
        returning: true,
        plain: true,
      });
      return result;
    } catch (ex) { }
  }
};
