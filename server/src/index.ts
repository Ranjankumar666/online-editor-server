import { config } from "dotenv";
config();
import express from "express";
import path from "path";
import { Server, ServerOptions } from "socket.io";
import http from "http";
import handler from "./socket/handler";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(path.join(process.cwd(), "./client/build")));

app.use(["/", "/*"], (_req, res) => {
    res.sendFile(path.join(process.cwd(), "./client/build/index.html"));
});

const corsConfig: ServerOptions["cors"] = {
    credentials: true,
    methods: "*",
    origin: "*",
};

const server = http.createServer(app);
const io = new Server(server, {
    cors: process.env.NODE_ENV !== "production" ? corsConfig : undefined,
});

io.on("connection", handler);

server.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});
