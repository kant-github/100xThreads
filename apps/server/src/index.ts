import { createServer } from "http";
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import Routes from "./routes";
import WebSocketServerManager from "./websockets/webSocketServer";
import prisma from "@repo/db/client";

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
  res.send("Server started Dipanshu gandu :)");
});

app.get("/store", async (req, res) => {
  const announcement = await prisma.announcement.create({
      data: {
          channel_id: '9af56c66-3a3c-4b83-af53-bdf5ec075a58',
          title: "Checkssss",
          content: "checksssss",
          priority: 'URGENT',
          tags: ['fee', 'checks', 'tags'],
          creator_org_user_id: 1,
      }
  })
  res.json({
      message: "created",
      data: announcement
  })
})


app.use("/api", Routes);

server.listen(7001, () => {
  console.log(`App is listening on port ${PORT}`);
}).on("error", (err) => {
  console.error(`Server failed to start on port ${PORT}:`, err.message);
});
