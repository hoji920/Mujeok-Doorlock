const express = require("express");
const router = express.Router();
const cors = require("cors"); // cors 라이브러리 import
const bodyParser = require("body-parser"); // body-parser 라이브러리 import

const { User } = require("../models/user");
const mongoConnect = require("../util/database").mongoConnect; // mongodb 데이터베이스

router.use(cors()); // cors 사용
router.use(bodyParser.json());

router.post("/login", (req, res, next) => {
  const { userId, userPw } = { ...req.body };
  console.log(userId, userPw);

  User.findById({ userId: userId })
    .then((user) => {
      if (!user || user.password !== userPw) {
        return res.status(401).json({ message: "Invalid username or password." });
      }
      res.status(200).json({ message: "Login successful.", userId: userId });
    })
    .catch((error) => {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Login failed." });
    });
});

router.post("/signup", (req, res, next) => {
  const { userId, userPw } = { ...req.body };
  console.log(req.body);
  console.log(userId, userPw);
  // 아이디나 비밀번호 중 하나라도 비어있을 경우
  if (userId === undefined || userPw === undefined) {
    return res.json({ message: "아이디와 비밀번호를 입력해주세요." });
  }

  User.findById({ userId: userId })
    .then((existingUser) => {
      if (existingUser) {
        return res.json({ message: "이미 존재하는 아이디입니다." });
      }

      const user = new User(userId, userPw);

      user
        .save()
        .then((result) => {
          console.log("User saved:", result);
          res.status(201).json({ message: "회원가입이 완료되었습니다.", success: true });
        })
        .catch((error) => {
          console.error("Error saving user:", error);
          res.status(500).json({ message: "회원가입 중 오류가 발생했습니다." });
        });
    })
    .catch((error) => {
      console.error("Error checking user:", error);
      res.status(500).json({ message: "회원가입 중 오류가 발생했습니다." });
    });
});

router.post("/force", (req, res, next) => {
  const data = { userId: req.body.userId, forceData: req.body.forceData };
  User.updataOneById(data).then((result) => {
    res.json({ message: "무적 변경" });
  });
});

module.exports = router;
