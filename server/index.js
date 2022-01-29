const express = require('express')
const app = express()
const cors = require("cors")
const pool = require("./db")

//middleware
app.use(cors())
app.use(express.json())

//ROUTES//

//create a todo
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        );

        res.json(newTodo);
    } catch (err) {
        console.log(err.message);
    }
});

//get all Announcements(paging)
app.get("/search/:page", async(req, res) => {
    try {
        const { page } = req.params;

        const allAnnouncement = await pool.query(
          "SELECT r.recruit_idx, o.organ_name, r.recruit_title, r.apply_start_time, r.apply_end_time, r.register_id, r.register_time, r.is_complete "
        + "FROM recruit r left join organization o on r.organ_idx = o.organ_idx "
        + "ORDER BY recruit_idx DESC "
        + "LIMIT 10 OFFSET ($1 - 1) * 10", [page]
        );

        res.json(allAnnouncement.rows)
    } catch (err) {
        console.log(err.message)
    }
})

//get a Announcement
app.get("/recruit/:id", async(req, res) => {
    try {
        const { id } = req.params;
        
        const Announcement = await pool.query(
          "SELECT o.organ_name, r.recruit_title, r.apply_start_time, r.apply_end_time, r.register_id, r.register_time, r.is_complete "
        + "FROM recruit r left join organization o on r.organ_idx = o.organ_idx "
        + "WHERE recruit_idx = $1", [id]
        );

        res.json(Announcement.rows[0])
    } catch (err) {
        console.log(err.message)
    }
})

//get count
app.get("/searchcnt", async(req, res) => {
    try {
        const cnt = await pool.query(
          "SELECT "
        + "(SELECT COUNT(*) FROM recruit) as \"all\", "
        + "(SELECT COUNT(*) FROM recruit WHERE apply_start_time <= now() AND apply_end_time >= now()) as \"ing\", "
        + "(SELECT COUNT(*) FROM recruit WHERE apply_end_time < now()) as \"end\", "
        + "(SELECT COUNT(*) FROM recruit WHERE apply_start_time > now()) as \"wait\" "
        );

        res.json(cnt.rows)
    } catch (err) {
        console.log(err.message)
    }
})

//delete a todo

app.listen(5000, () => {
    console.log("server has started on port 5000")
})