const fs = require("fs");

function readAndPrintIndexes() {
  fs.readFile("raw.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    try {
      const jsonArray = JSON.parse(data);
      for (let i = 0; i < 11; i++) {
        const randomIndex = Math.floor(Math.random() * jsonArray.length);
        jsonArray.splice(randomIndex, 1);
      }
      jsonArray.forEach((item, index) => {
        item.id = index + 1;
        item.pendingTime =
          Math.floor(Math.random() * (5 * 60 * 60 * 1000 - 5 * 60 * 1000 + 1)) +
          5 * 60 * 1000;
        item.content =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
      });

      fs.writeFile(
        "messages.json",
        JSON.stringify(jsonArray, null, 2),
        (writeErr) => {
          if (writeErr) {
            console.error("Error writing file:", writeErr);
            return;
          }
          console.log("File has been written successfully.");
        }
      );
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
    }
  });
}

readAndPrintIndexes();
