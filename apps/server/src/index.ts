import { createServer } from "http";
import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";
import fileUpload from "express-fileupload";
import Routes from "./routes"; 
import { setupWebSocket } from "./socket";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp',
    })
);

const PORT = process.env.PORT || 7001;

const server = createServer(app);


const wss = new WebSocketServer({ server });


// setupWebSocket(wss);

app.get("/health-check", (req, res) => {
    res.send("Server started");
});

app.use("/api", Routes);

// Start the server
server.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
}).on("error", (err) => {
    console.error(`Server failed to start on port ${PORT}:`, err.message);
});
