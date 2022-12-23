import express, { Response } from "express";
import ImageHandler from "./image";
import multer from 'multer'
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());


const http = require("http");
const server = http.createServer(app);

const imageHandler = new ImageHandler()

const upload = multer();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.get("/", (request, response) => {
  response.send("Backend service is running");
});

app.post("/images/process", upload.single('image'), (request, response: Response) => {
  imageHandler.getUploadedImage(request, response)
});

app.post("/upload-image", (request, response: Response) => {
  imageHandler.uploadImageToFile(request, response)
});

app.post("/images/random", (request, response: Response) => {
  imageHandler.addRandomImage(request, response)
});

app.get("/images", (request, response: Response) => {
  imageHandler.getAllImages(request, response)
});

app.use(express.static('public'));


server.listen(port, (err?: Error) => {
  if (err) {
    return console.error("Oops something exploded:", err);
  }

  console.log(`Server ready on http://localhost:${port} 🤟`);
});
