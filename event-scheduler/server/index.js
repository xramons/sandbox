const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const PORT = 4000;
const socketIO = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000",
    },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let eventList = [];

socketIO.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("newSchedule", (schedule) => {
        eventList.unshift(schedule);
        socket.emit("sendSchedules", eventList);
    });

    let interval = setInterval(function () {
        if (eventList.length > 0) {
            for (let i = 0; i < eventList.length; i++) {
                if (
                    Number(eventList[i].hour) === new Date().getHours() &&
                    Number(eventList[i].minute) === new Date().getMinutes() &&
                    new Date().getSeconds() === 0
                ) {
                    socket.emit("notification", {
                        title: eventList[i].title,
                        hour: eventList[i].hour,
                        mins: eventList[i].minute,
                    });
                }
            }
        }
    }, 1000);

    socket.on("disconnect", () => {
        socket.disconnect();
    });
});

app.get("/api", async (req, res) => {
    res.json(trigger.data);
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
