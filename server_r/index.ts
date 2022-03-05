import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import crypto from "crypto";

const app = express();
const pool = require("./db");
const jwt = require("./jwt");

//middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//ROUTES//

//create a todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description],
    );

    res.json(newTodo);
  } catch (err) {
    console.log(err);
  }
});

//get all Announcements(paging)
app.get("/search", async (req, res) => {
  try {
    // const auth = req.headers.authorization;
    // const accessToken = auth?.includes("Bearer ")
    //   ? auth.split("Bearer ")[1]
    //   : auth;
    // console.log(accessToken);

    // const userinfo = await jwt.verify(accessToken);
    // console.log(userinfo);

    // res.json(userinfo);

    const page: string = req.query.page as string;
    const state: string = req.query.state as string;
    const complete: string = req.query.complete as string;
    const searchtxt: string = req.query.searchtxt as string;

    let WHERE = "WHERE 1=1 ";

    if (state == "ing") {
      WHERE += "AND r.apply_start_time <= now() AND r.apply_end_time >= now() ";
    } else if (state == "end") {
      WHERE += "AND r.apply_end_time < now() ";
    } else if (state == "wait") {
      WHERE += "AND r.apply_start_time > now() ";
    }

    if (complete == "true") {
      WHERE += "AND r.is_complete = true ";
    }

    if (searchtxt.trim() != null) {
      WHERE += "AND r.recruit_title like '%" + searchtxt.trim() + "%' ";
    }

    const allAnnouncement = await pool.query(
      "SELECT r.recruit_idx, o.organ_name, r.recruit_title, CASE WHEN (apply_start_time <= now() AND apply_end_time >= now()) THEN '접수중' WHEN (apply_end_time < now()) THEN '마감' WHEN (apply_start_time > now()) THEN '대기중' END as \"state\", r.apply_start_time, r.apply_end_time, r.register_id, r.register_time, r.is_complete\n" +
        "FROM recruit r left join organization o on r.organ_idx = o.organ_idx\n" +
        WHERE +
        "\nORDER BY recruit_idx DESC\n" +
        "LIMIT 10 OFFSET (" +
        page +
        " - 1) * 10\n\n",
    );

    res.json(allAnnouncement.rows);
  } catch (err) {
    console.log(err);
  }
});

app.get("/total", async (req, res) => {
  try {
    const state: string = req.query.state as string;
    const complete: string = req.query.complete as string;
    const searchtxt: string = req.query.searchtxt as string;

    let WHERE = "WHERE 1=1 ";

    if (state == "ing") {
      WHERE += "AND r.apply_start_time <= now() AND r.apply_end_time >= now() ";
    } else if (state == "end") {
      WHERE += "AND r.apply_end_time < now() ";
    } else if (state == "wait") {
      WHERE += "AND r.apply_start_time > now() ";
    }

    if (complete == "true") {
      WHERE += "AND r.is_complete = true ";
    }

    if (searchtxt.trim() != null) {
      WHERE += "AND r.recruit_title like '%" + searchtxt.trim() + "%' ";
    }

    const allcnt = await pool.query(
      "SELECT COUNT(*)\n" +
        "FROM recruit r left join organization o on r.organ_idx = o.organ_idx\n" +
        WHERE,
    );

    res.json(allcnt.rows);
  } catch (err) {
    console.log(err);
  }
});

//get a Announcement
app.get("/recruit/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const Announcement = await pool.query(
      "SELECT o.organ_name, r.recruit_title, r.apply_start_time, r.apply_end_time, r.register_id, r.register_time, r.is_complete " +
        "FROM recruit r left join organization o on r.organ_idx = o.organ_idx " +
        "WHERE recruit_idx = $1",
      [id],
    );

    res.json(Announcement.rows[0]);
  } catch (err) {
    console.log(err);
  }
});

//get count
app.get("/searchcnt", async (req, res) => {
  try {
    const complete: string = req.query.complete as string;
    const searchtxt: string = req.query.searchtxt as string;

    let WHERE = "WHERE 1=1 ";

    if (complete == "true") {
      WHERE += "AND is_complete = true ";
    }

    if (searchtxt.trim() != null) {
      WHERE += "AND recruit_title like '%" + searchtxt.trim() + "%' ";
    }

    const cnt = await pool.query(
      "SELECT " +
        "(SELECT COUNT(*) FROM recruit " +
        WHERE +
        ') as "all", ' +
        "(SELECT COUNT(*) FROM recruit " +
        WHERE +
        ' AND apply_start_time <= now() AND apply_end_time >= now()) as "ing", ' +
        "(SELECT COUNT(*) FROM recruit " +
        WHERE +
        ' AND apply_end_time < now()) as "end", ' +
        "(SELECT COUNT(*) FROM recruit " +
        WHERE +
        ' AND apply_start_time > now()) as "wait" ',
    );

    res.json(cnt.rows);
  } catch (err) {
    console.log(err);
  }
});

app.use(function (req, res, next) {
  //모든 도메인의 요청을 허용하지 않으면 웹브라우저에서 CORS 에러를 발생시킨다.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization",
  );
  next();
});

// login
app.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await pool.query(
      "SELECT * " +
        "FROM app_member " +
        "WHERE member_id = '" +
        userId +
        "' AND pwd = '" +
        crypto.createHash("sha256").update(password).digest("base64") +
        "' ",
    );

    if (Object.keys(user.rows).length) {
      const jwtToken = await jwt.sign(user);

      console.log(jwtToken);

      res.json({
        success: true,
        accessToken: jwtToken.accesstoken,
        refreshToken: jwtToken.refreshtoken,
      });
    } else {
      res.json({ success: false, err: "아이디 또는 비밀번호를 확인하세요." });
    }
  } catch (err) {
    res.json({ success: false, err });
  }
});

// getUser
app.get("/getUser", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    const accessToken = auth?.includes("Bearer ")
      ? auth.split("Bearer ")[1]
      : auth;

    const userinfo = await jwt.verify(accessToken);
    console.log(userinfo);
    if (userinfo < 0) {
      res.json("false");
    } else {
      res.json(userinfo);
    }

    // if (Object.keys(user.rows).length) {
    //     const userinfo = await jwt.verify(user)

    //     res.json(userinfo);
    // } else {
    //     res.json({success:false, err:"아이디 또는 비밀번호를 확인하세요."});
    // }
  } catch (err) {
    res.json({ success: false, err });
  }
});

// getUser
app.get("/refresh", async (req, res) => {
  console.log("재발급");
  try {
    const auth = req.headers.authorization;
    const refreshToken = auth?.includes("Bearer ")
      ? auth.split("Bearer ")[1]
      : auth;

    const userinfo = await jwt.verify(refreshToken);

    if (userinfo < 0) {
      res.json("false");
    } else {
      const user = await pool.query(
        "SELECT * " +
          "FROM app_member " +
          "WHERE member_id = '" +
          userinfo.id +
          "' ",
      );

      if (Object.keys(user.rows).length) {
        const jwtToken = await jwt.sign(user);

        const userinfo = await jwt.verify(jwtToken.accesstoken);

        res.cookie("test", "test", {
          expires: new Date(Date.now() + 900000),
          path: "localhost:8080",
        });
        res.cookie("accessToken", jwtToken.accesstoken);

        console.log(req.cookies);
        res.json({
          success: true,
          userinfo: userinfo,
          accessToken: jwtToken.accesstoken,
        });
      } else {
        res.json({ success: false, err: "아이디 또는 비밀번호를 확인하세요." });
      }
    }
  } catch (err) {
    res.json({ success: false, err });
  }
});
//delete a todo

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
