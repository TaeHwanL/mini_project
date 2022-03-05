"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var crypto_1 = __importDefault(require("crypto"));
var app = (0, express_1.default)();
var pool = require("./db");
var jwt = require("./jwt");
//middleware
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
//ROUTES//
//create a todo
app.post("/todos", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var description, newTodo, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                description = req.body.description;
                return [4 /*yield*/, pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description])];
            case 1:
                newTodo = _a.sent();
                res.json(newTodo);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//get all Announcements(paging)
app.get("/search", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var page, state, complete, searchtxt, WHERE, allAnnouncement, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                page = req.query.page;
                state = req.query.state;
                complete = req.query.complete;
                searchtxt = req.query.searchtxt;
                WHERE = "WHERE 1=1 ";
                if (state == "ing") {
                    WHERE += "AND r.apply_start_time <= now() AND r.apply_end_time >= now() ";
                }
                else if (state == "end") {
                    WHERE += "AND r.apply_end_time < now() ";
                }
                else if (state == "wait") {
                    WHERE += "AND r.apply_start_time > now() ";
                }
                if (complete == "true") {
                    WHERE += "AND r.is_complete = true ";
                }
                if (searchtxt.trim() != null) {
                    WHERE += "AND r.recruit_title like '%" + searchtxt.trim() + "%' ";
                }
                return [4 /*yield*/, pool.query("SELECT r.recruit_idx, o.organ_name, r.recruit_title, CASE WHEN (apply_start_time <= now() AND apply_end_time >= now()) THEN '접수중' WHEN (apply_end_time < now()) THEN '마감' WHEN (apply_start_time > now()) THEN '대기중' END as \"state\", r.apply_start_time, r.apply_end_time, r.register_id, r.register_time, r.is_complete\n" +
                        "FROM recruit r left join organization o on r.organ_idx = o.organ_idx\n" +
                        WHERE +
                        "\nORDER BY recruit_idx DESC\n" +
                        "LIMIT 10 OFFSET (" +
                        page +
                        " - 1) * 10\n\n")];
            case 1:
                allAnnouncement = _a.sent();
                res.json(allAnnouncement.rows);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.log(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/total", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var state, complete, searchtxt, WHERE, allcnt, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                state = req.query.state;
                complete = req.query.complete;
                searchtxt = req.query.searchtxt;
                WHERE = "WHERE 1=1 ";
                if (state == "ing") {
                    WHERE += "AND r.apply_start_time <= now() AND r.apply_end_time >= now() ";
                }
                else if (state == "end") {
                    WHERE += "AND r.apply_end_time < now() ";
                }
                else if (state == "wait") {
                    WHERE += "AND r.apply_start_time > now() ";
                }
                if (complete == "true") {
                    WHERE += "AND r.is_complete = true ";
                }
                if (searchtxt.trim() != null) {
                    WHERE += "AND r.recruit_title like '%" + searchtxt.trim() + "%' ";
                }
                return [4 /*yield*/, pool.query("SELECT COUNT(*)\n" +
                        "FROM recruit r left join organization o on r.organ_idx = o.organ_idx\n" +
                        WHERE)];
            case 1:
                allcnt = _a.sent();
                res.json(allcnt.rows);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.log(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//get a Announcement
app.get("/recruit/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, Announcement, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, pool.query("SELECT o.organ_name, r.recruit_title, r.apply_start_time, r.apply_end_time, r.register_id, r.register_time, r.is_complete " +
                        "FROM recruit r left join organization o on r.organ_idx = o.organ_idx " +
                        "WHERE recruit_idx = $1", [id])];
            case 1:
                Announcement = _a.sent();
                res.json(Announcement.rows[0]);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                console.log(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//get count
app.get("/searchcnt", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var complete, searchtxt, WHERE, cnt, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                complete = req.query.complete;
                searchtxt = req.query.searchtxt;
                WHERE = "WHERE 1=1 ";
                if (complete == "true") {
                    WHERE += "AND is_complete = true ";
                }
                if (searchtxt.trim() != null) {
                    WHERE += "AND recruit_title like '%" + searchtxt.trim() + "%' ";
                }
                return [4 /*yield*/, pool.query("SELECT " +
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
                        ' AND apply_start_time > now()) as "wait" ')];
            case 1:
                cnt = _a.sent();
                res.json(cnt.rows);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                console.log(err_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.use(function (req, res, next) {
    //모든 도메인의 요청을 허용하지 않으면 웹브라우저에서 CORS 에러를 발생시킨다.
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Authorization");
    next();
});
// login
app.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, password, user, jwtToken, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, userId = _a.userId, password = _a.password;
                return [4 /*yield*/, pool.query("SELECT * " +
                        "FROM app_member " +
                        "WHERE member_id = '" +
                        userId +
                        "' AND pwd = '" +
                        crypto_1.default.createHash("sha256").update(password).digest("base64") +
                        "' ")];
            case 1:
                user = _b.sent();
                if (!Object.keys(user.rows).length) return [3 /*break*/, 3];
                return [4 /*yield*/, jwt.sign(user)];
            case 2:
                jwtToken = _b.sent();
                console.log(jwtToken);
                res.json({
                    success: true,
                    accessToken: jwtToken.accesstoken,
                    refreshToken: jwtToken.refreshtoken,
                });
                return [3 /*break*/, 4];
            case 3:
                res.json({ success: false, err: "아이디 또는 비밀번호를 확인하세요." });
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_6 = _b.sent();
                res.json({ success: false, err: err_6 });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// getUser
app.get("/getUser", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var auth, accessToken, userinfo, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                auth = req.headers.authorization;
                accessToken = (auth === null || auth === void 0 ? void 0 : auth.includes("Bearer "))
                    ? auth.split("Bearer ")[1]
                    : auth;
                return [4 /*yield*/, jwt.verify(accessToken)];
            case 1:
                userinfo = _a.sent();
                console.log(userinfo);
                if (userinfo < 0) {
                    res.json("false");
                }
                else {
                    res.json(userinfo);
                }
                return [3 /*break*/, 3];
            case 2:
                err_7 = _a.sent();
                res.json({ success: false, err: err_7 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// getUser
app.get("/refresh", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var auth, refreshToken, userinfo, user, jwtToken, userinfo_1, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("재발급");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
                auth = req.headers.authorization;
                refreshToken = (auth === null || auth === void 0 ? void 0 : auth.includes("Bearer "))
                    ? auth.split("Bearer ")[1]
                    : auth;
                return [4 /*yield*/, jwt.verify(refreshToken)];
            case 2:
                userinfo = _a.sent();
                if (!(userinfo < 0)) return [3 /*break*/, 3];
                res.json("false");
                return [3 /*break*/, 8];
            case 3: return [4 /*yield*/, pool.query("SELECT * " +
                    "FROM app_member " +
                    "WHERE member_id = '" +
                    userinfo.id +
                    "' ")];
            case 4:
                user = _a.sent();
                if (!Object.keys(user.rows).length) return [3 /*break*/, 7];
                return [4 /*yield*/, jwt.sign(user)];
            case 5:
                jwtToken = _a.sent();
                return [4 /*yield*/, jwt.verify(jwtToken.accesstoken)];
            case 6:
                userinfo_1 = _a.sent();
                res.cookie("test", "test", {
                    expires: new Date(Date.now() + 900000),
                    path: "localhost:8080",
                });
                res.cookie("accessToken", jwtToken.accesstoken);
                console.log(req.cookies);
                res.json({
                    success: true,
                    userinfo: userinfo_1,
                    accessToken: jwtToken.accesstoken,
                });
                return [3 /*break*/, 8];
            case 7:
                res.json({ success: false, err: "아이디 또는 비밀번호를 확인하세요." });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                err_8 = _a.sent();
                res.json({ success: false, err: err_8 });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
//delete a todo
app.listen(5000, function () {
    console.log("server has started on port 5000");
});
//# sourceMappingURL=index.js.map