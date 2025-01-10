const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const messages = require("./messages");
const readline = require("readline");

const configuration = {
  sla: [
    {
      label: "0 - 1 horas",
      value: 0,
      color: "#008000",
    },
    {
      label: "1 - 2 horas",
      value: 270,
      color: "#FFDE21",
    },
    {
      label: "2+ horas",
      value: 540,
      color: "#FF0000",
    },
  ],
  categories: [
    {
      id: 222,
      name: "Op. comercial",
    },
    {
      id: 333,
      name: "Posible fuga",
    },
    {
      id: 444,
      name: "Reclamo",
    },
  ],
};

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  socket.emit("messages", {
    data: {
      messages,
      sla: configuration.sla,
      categories: configuration.categories,
    },
  });

  socket.on("action", (msg) => {
    if (msg.action === "connect")
      socket.emit("messages", {
        data: {
          messages,
          sla: configuration.sla,
          categories: configuration.categories,
        },
      });
    console.log("Received action:", msg);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Enter message: ",
  });

  rl.prompt();
  rl.on("line", (line) => {
    const text = line.trim();
    if (text === "message") {
      const message = {
        id: 1,
        threadId: "asdasdsa",
        subject: "This is a new message subject",
        receivedDate: "2025-01-10T08:39:35",
        category: 222,
      };
      io.emit("message", message);
    } else {
      io.emit("message", { text: line.trim() });
    }

    console.log("Message sent to clients");
    rl.prompt();
  });
});
