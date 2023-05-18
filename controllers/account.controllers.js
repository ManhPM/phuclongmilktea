const {
  Account,
  Shipper,
  Customer,
  Role,
  Wishlist,
  Cart,
} = require("../models");
const { QueryTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const createAccountForCustomer = async (req, res) => {
  const { username, password, name, email, phone, address } = req.body;
  try {
    //tạo ra một chuỗi ngẫu nhiên
    const salt = bcrypt.genSaltSync(10);
    //mã hoá salt + password
    const hashPassword = bcrypt.hashSync(password, salt);
    const newAccount = await Account.create({
      username,
      id_role: 1,
      password: hashPassword,
    });
    const customer = await Customer.findOne({
      where: {
        email,
      },
    });
    if (customer) {
      customer.id_account = newAccount.id_account;
      await customer.save();

      await Cart.create({
        id_customer: customer.id_customer,
      });

      await Wishlist.create({
        id_customer: customer.id_customer,
      });
    } else {
      const newCustomer = await Customer.create({
        id_account: newAccount.id_account,
        name,
        email,
        phone,
        address,
      });
      await Cart.create({
        id_customer: newCustomer.id_customer,
      });
      await Wishlist.create({
        id_customer: newCustomer.id_customer,
      });
      res.status(200).json({
        message: "Đăng ký thành công!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Đăng ký thất bại!",
    });
  }
};

const createAccountForShipper = async (req, res) => {
  const {
    username,
    password,
    name,
    email,
    phone,
    address,
    id_shipping_partner,
    description,
  } = req.body;
  try {
    //tạo ra một chuỗi ngẫu nhiên
    const salt = bcrypt.genSaltSync(10);
    //mã hoá salt + password
    const hashPassword = bcrypt.hashSync(password, salt);
    const newAccount = await Account.create({
      username,
      id_role: 4,
      password: hashPassword,
    });
    await Shipper.create({
      id_account: newAccount.id_account,
      name,
      email,
      phone,
      address,
      description,
      id_shipping_partner,
    });
    res.status(200).json({
      message: "Đăng ký thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Đăng ký thất bại!",
    });
  }
};

const loginStaff = async (req, res) => {
  const { username, password } = req.body;
  const account = await Account.findOne({
    where: {
      username,
    },
  });
  if (account.id_role != 2 && account.id_role != 3) {
    res.status(400).json({ message: "Tài khoản không có quyền truy cập!" });
  } else {
    const isAuth = bcrypt.compareSync(password, account.password);
    if (isAuth) {
      const token = jwt.sign({ username: account.username }, "manhpham2k1", {
        expiresIn: 30 * 24 * 60 * 60,
      });
      res.status(200).json({
        message: "Đăng nhập thành công!",
        token,
        expireTime: 30 * 24 * 60 * 60,
      });
    } else {
      res.status(400).json({ message: "Sai thông tin đăng nhập!" });
    }
  }
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  const account = await Account.findOne({
    where: {
      username,
    },
  });
  if (account.id_role == 5) {
    const isAuth = bcrypt.compareSync(password, account.password);
    if (isAuth) {
      const token = jwt.sign({ username: account.username }, "manhpham2k1", {
        expiresIn: 30 * 24 * 60 * 60,
      });
      res.status(200).json({
        message: "Đăng nhập thành công!",
        token,
        expireTime: 30 * 24 * 60 * 60,
      });
    } else {
      res.status(400).json({ message: "Sai thông tin đăng nhập!" });
    }
  } else {
    res.status(400).json({ message: "Tài khoản không có quyền truy cập!" });
  }
};

const loginShipper = async (req, res) => {
  const { username, password } = req.body;
  const account = await Account.findOne({
    where: {
      username,
    },
  });
  if (account.id_role != 4) {
    res.status(400).json({ message: "Tài khoản không có quyền truy cập!" });
  } else {
    const shipper = await Shipper.findOne({
      where: {
        id_account: account.id_account,
      },
    });
    const isAuth = bcrypt.compareSync(password, account.password);
    if (isAuth) {
      const token = jwt.sign({ username: account.username }, "manhpham2k1", {
        expiresIn: 30 * 24 * 60 * 60,
      });
      res.status(200).json({
        message: "Đăng nhập thành công!",
        token,
        expireTime: 30 * 24 * 60 * 60,
        shipperInfo: shipper,
      });
    } else {
      res.status(400).json({ message: "Sai thông tin đăng nhập!" });
    }
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const account = await Account.findOne({
    where: {
      username,
    },
  });
  const isAuth = bcrypt.compareSync(password, account.password);
  if (isAuth) {
    const customer = await Customer.findOne({
      where: {
        id_account: account.id_account,
      },
    });
    const token = jwt.sign({ username: account.username }, "manhpham2k1", {
      expiresIn: 30 * 60 * 60 * 24,
    });
    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      userInfo: customer,
      expireTime: 60 * 60 * 24,
    });
  } else {
    res.status(400).json({ message: "Sai thông tin đăng nhập!" });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, repeatPassword } = req.body;
  try {
    const accountUpdate = await Account.findOne({
      where: {
        username: req.username,
      },
    });
    const isAuth = bcrypt.compareSync(oldPassword, accountUpdate.password);
    if (isAuth) {
      if (newPassword == repeatPassword) {
        if (newPassword == oldPassword) {
          res.status(400).json({
            message: "Mật khẩu mới không được giống với mật khẩu cũ!",
          });
        } else {
          //tạo ra một chuỗi ngẫu nhiên
          const salt = bcrypt.genSaltSync(10);
          //mã hoá salt + password
          const hashPassword = bcrypt.hashSync(newPassword, salt);
          if (accountUpdate.active == 0) {
            accountUpdate.active = 1;
          }
          accountUpdate.password = hashPassword;
          await accountUpdate.save();
          res.status(200).json({
            message: "Đổi mật khẩu thành công!",
          });
        }
      } else {
        res.status(400).json({
          message: "Mật khẩu lặp lại không đúng!",
        });
      }
    } else {
      res.status(400).json({
        message: "Mật khẩu không chính xác!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Thao tác thất bại!",
    });
  }
};

const logout = async (req, res, next) => {
  res.removeHeader("access_token");
  res.status(200).json({ message: "Đăng xuất thành công!" });
};

const forgotPassword = async (req, res) => {
  const { username } = req.body;
  try {
    const randomID = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    const isExist = await Account.findOne({
      where: {
        forgot: randomID,
      },
    });
    if (isExist !== null) {
      res.status(400).json({
        message: `Có lỗi xảy ra vui lòng thử lại!`,
      });
    } else {
      const account = await Account.sequelize.query(
        "SELECT CU.email FROM customers as CU, accounts as A WHERE A.id_account = CU.id_account AND A.username = :username",
        {
          type: QueryTypes.SELECT,
          replacements: {
            username: username,
          },
        }
      );
      await Account.sequelize.query(
        "UPDATE accounts SET forgot = :randomID WHERE username = :username",
        {
          type: QueryTypes.UPDATE,
          replacements: {
            randomID: randomID,
            username: username,
          },
        }
      );
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "n19dccn107@student.ptithcm.edu.vn", // generated ethereal user
          pass: "bqztpfkmmbpzmdxl", // generated ethereal password
        },
      });
      // send mail with defined transport object
      await transporter.sendMail({
        from: "n19dccn107@student.ptithcm.edu.vn", // sender address
        to: `${account[0].email}`, // list of receivers
        subject: "FORGOT PASSWORD", // Subject line
        text: "FORGOT PASSWORD", // plain text body
        html: `Mã xác nhận của bạn là: ${randomID}`, // html body
      });
      var s2 = account[0].email;
      var s1 = s2.substring(0, s2.length - 15);
      var s3 = s2.substring(s2.length - 15, s2.length);
      var email = s1 + s3.replace(/\S/gi, "*");
      res.status(200).json({
        message: `Mã xác minh đã được gửi về email: ${email} vui lòng kiểm tra hòm thư!`,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const verify = async (req, res, next) => {
  const { verifyID, username } = req.body;
  const account = await Account.findOne({
    where: {
      forgot: verifyID,
      username,
    },
    raw: true,
  });
  if (account) {
    res.status(200).json({
      message: `Mã xác nhận chính xác!`,
      isSuccess: true,
    });
  } else {
    res.status(400).json({
      message: `Mã xác nhận không chính xác!`,
      isSuccess: false,
    });
  }
};

const accessForgotPassword = async (req, res, next) => {
  const { username, password, repeatPassword } = req.body;
  if (password != repeatPassword) {
    res.status(400).json({
      message: `Mật khẩu lặp lại không chính xác!`,
    });
  } else {
    const salt = bcrypt.genSaltSync(10);
    //mã hoá salt + password
    const hashPassword = bcrypt.hashSync(password, salt);
    try {
      const accountUpdate = await Account.findOne({
        where: {
          username,
        },
      });
      accountUpdate.password = hashPassword;
      accountUpdate.forgot = 0;
      if (accountUpdate.active == 0) {
        accountUpdate.active = 1;
      }
      await accountUpdate.save();
      res.status(200).json({
        message: `Lấy lại mật khẩu thành công!`,
      });
    } catch (error) {
      res.status(500).json({
        message: `Lấy lại mật khẩu thất bại!`,
      });
    }
  }
};

// const information = async (req, res) => {
//   const { username } = req;
//   const infors = await Account.sequelize.query(
//     "SELECT NV.*, PQ.tenQuyen FROM taikhoans as TK, nhanviens as NV, phanquyens as PQ WHERE TK.maNV = NV.maNV AND NV.maQuyen = PQ.maQuyen AND TK.username = :username",
//     {
//       type: QueryTypes.SELECT,
//       replacements: {
//         username: username,
//       },
//     }
//   );
//   res.status(200).json("infor", {
//     infors: infors[0],
//   });
// };

module.exports = {
  // getDetailTaiKhoan,
  login,
  loginStaff,
  loginShipper,
  loginAdmin,
  logout,
  createAccountForCustomer,
  // information,
  // create,
  changePassword,
  // edit,
  // logout,
  forgotPassword,
  // getforgot,
  // formlogin,
  verify,
  accessForgotPassword,
  createAccountForShipper,
};
