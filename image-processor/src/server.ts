import express from "express";
import ImageProcessor from "./processor";
require('dotenv').config()

const app = express();
const port = 3001;
const imageProcessor = new ImageProcessor()
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));


app.get("/", (request, response) => {
  response.send("Image processor service is running");
});

app.post("/process-image", (request, response) => {
  imageProcessor.returnProcessedImages(request, response)
});

app.listen(port, (err?: Error) => {
  if (err) {
    return console.error("Oops something exploded:", err);
  }

  console.log(`Server ready on http://localhost:${port} 🤟`);
});
