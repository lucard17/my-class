import express from "express";
import { apiLogger as log } from "./logger/logger.service.js";
import { lessonsRouter } from "./lessons/lessons.controller.js";

const app = express();

app.get("/", (req, res) => {
    log.debug(`GET /`);
    res.json({ message: "Hello World!" });
});
app.use("/lessons", lessonsRouter);

if (process.env.NODE_ENV === "development") {
    app.get("/restart", (req, res) => {
        log.debug(`GET /restart`);
        res.send("restart");
        process.exit(0);
    });
}

const port = process.env.PORT || 5005;
app.listen(port, () => {
    log.info("Server is running on port %s", port);
});
