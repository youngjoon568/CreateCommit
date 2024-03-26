import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import express from "express";
import Demo from "./module/llama.mjs";

const PORT = 5000;

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on("connection", (socket) => {
    console.log("클라이언트가 연결되었습니다.");

    socket.on("send_message", async (msg) => {
        try {
            const responseMessage = await Demo(msg);

            socket.emit("receive_message", responseMessage);
        } catch (error) {
            console.log(error);
            console.error("Llama 모델 호출 중 오류 발생:", error);

            socket.emit("receive_message", "오류가 발생했습니다.");
        }
    });

    socket.on("disconnect", () => {
        console.log("클라이언트가 연결을 끊었습니다.");
    });
});

server.listen(PORT, () => {
    console.log(`서버가 ${PORT}번 포트에서 실행중입니다.`);
});
