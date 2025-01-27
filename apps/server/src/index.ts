import { createServer } from "http";
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import Routes from "./routes";
import WebSocketServerManager from "./websockets/webSocketServer";

const app = express();

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
new WebSocketServerManager(server);


app.get("/health-check", (req, res) => {
  res.send("Server started");
});

app.use("/api", Routes);

server.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
}).on("error", (err) => {
  console.error(`Server failed to start on port ${PORT}:`, err.message);
});
