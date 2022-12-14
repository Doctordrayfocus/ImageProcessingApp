import axios from "axios";
import { Request, response, Response } from "express";
import sharp from "sharp";

export default class ImageProcessor {
  constructor() {
  //
  }

  private activeProcesses = 0;
 
  private possibleColorArrays = [
    [
      [0, 8, 20],
      [0, 29, 61],
      [0, 53, 102],
      [255, 195, 0],
      [255, 214, 10],
    ],
    [
      [51, 92, 103],
      [255, 243, 176],
      [224, 159, 62],
      [158, 42, 43],
      [84, 11, 14],
    ],
    [
      [61, 52, 139],
      [118, 120, 237],
      [247, 184, 1],
      [241, 135, 1],
      [243, 91, 4],
    ],
    [
      [0, 20, 39],
      [112, 141, 129],
      [244, 213, 141],
      [191, 6, 3],
      [141, 8, 1],
    ],
  ];

  public processImage = (imageBuffer: Buffer) => {
    const allOperations: any[] = [];
    const randmColorGroup = Math.floor(Math.random() * 4);

    allOperations.push(sharp(imageBuffer).grayscale().toBuffer());

    this.possibleColorArrays[randmColorGroup].forEach((colorArray, index) => {
      allOperations.push(
        sharp(imageBuffer)
          .tint({ r: colorArray[0], g: colorArray[1], b: colorArray[2] })
          .toBuffer()
      );
    });

    const finalImagesBase64: Buffer[] = [];

    return Promise.all(allOperations).then((finalData) => {
      finalData.forEach((imageBuffer: any) => {
        finalImagesBase64.push(imageBuffer);
      });

      return finalImagesBase64;
    });
  };

  public returnProcessedImages = (req: Request, res: Response) => {
    const reqData = req.body;
    this.activeProcesses++;
    console.log(this.activeProcesses);
    if (this.activeProcesses > 4) {
      res.status(500).send({
        message: "Maximum active process exceeded!",
      });
    } else {
      this.processAndUploadImages(
        reqData.imageUrl,
        reqData.imageId,
        reqData.imageExtension,
        res
      );
    }
  };

  public processAndUploadImages = (
    imageUrl: string,
    imageId: string,
    imageExtension: string,
    res: undefined | Response
  ) => {
    this.getImageStringFromUrl(imageUrl).then((imageBuffer) => {
      this.processImage(imageBuffer).then((bufferImages) => {
        const uploadProcessedImages: any[] = [];

        bufferImages.forEach((bufferImage) => {
          const randomId = "id" + Math.random().toString(16).slice(2);
          uploadProcessedImages.push(
            this.uploadImageToCloud(
              "processed-" + randomId,
              imageExtension,
              bufferImage
            )
          );
        });

        Promise.all(uploadProcessedImages)
          .then((values) => {
            if (res) {
              this.activeProcesses--;
              res?.json(values);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    });
  };

  public getImageStringFromUrl = (imageUrl: string) => {
    return axios
      .get(imageUrl, { responseType: "arraybuffer" })
      .then((response) => {
        return Buffer.from(response.data);
      });
  };


  public uploadImageToCloud = (
    imageId: string,
    imageExtension: string,
    imageBuffer: Buffer
  ) => {
    return axios
      .post("http://localhost:3000/upload-image", {
        imageId,
        imageExtension,
        image: imageBuffer.toString("base64"),
      })
      .then((response) => {
        return `http://localhost:3000/images/${imageId}.${imageExtension}`;
      });
  };

}
