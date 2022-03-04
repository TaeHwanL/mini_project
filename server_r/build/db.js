"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var pool = new pg_1.Pool({
    user: "postgres",
    password: "940330",
    host: "localhost",
    port: 5432,
    database: "postgres",
});
module.exports = pool;
//# sourceMappingURL=db.js.map