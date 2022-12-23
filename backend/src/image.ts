import { Image, PrismaClient } from "@prisma/client";
import axios from "axios";
import { Request, response, Response } from "express";
import fs from "fs";
import { createClient } from "pexels";

export default class ImageHandler {
  constructor() {
    //
  }

  private prisma = new PrismaClient();

  private decodeBase64Image(dataString: string) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response: any = {};

    if (matches?.length !== 3) {
      return new Error("Invalid input string");
    }

    response.type = matches[1];
    response.data = Buffer.from(matches[2], "base64");

    return response;
  }

  private getImageName = (fileName: string, randomId: string) => {
    return `${fileName.split(".")[0]}${randomId}.${
      fileName.split(".")[fileName.split(".").length - 1]
    }`;
  };

  public saveImageToDisk = (base64Image: string, metadata: any) => {
    const finalBase64Image = this.decodeBase64Image(base64Image);

    // save to disk
    fs.writeFile(
      "public/images/" + this.getImageName(metadata.name, metadata.randomId),
      finalBase64Image.data,
      (err) => {
        console.log(err);
      }
    );
  };

  public getUploadedImage = (req: Request, res: Response) => {
    const image = req.file;

    const architectureType = req.body.architectureType || "request-driven";

    const randomId = "id" + Math.random().toString(16).slice(2);
    const metadata = {
      name: image?.originalname,
      mimetype: image?.mimetype,
      size: image?.size,
      extension: `${
        image?.originalname.split(".")[image.originalname.split(".").length - 1]
      }`,
      randomId,
    };

    const dataImagePrefix = `data:${image?.mimetype};base64,`;

    const fullBase64Image = `${dataImagePrefix}${image?.buffer.toString(
      "base64"
    )}`;

    // save file to disk
    this.saveImageToDisk(fullBase64Image, metadata);

    const imageFullUrl =
      "http://localhost:3000/images/" +
      this.getImageName(metadata.name || "", metadata.randomId);

    // save to database
    this.saveImageToDatabase(metadata, imageFullUrl).then((imageData) => {
      this.handleRequestByArchtecture(
        architectureType,
        imageData,
        imageFullUrl,
        res
      );
    });
  };

  public saveImageToDatabase = async (metadata: any, imageUrl: string) => {
    const image = await this.prisma.image.create({
      data: {
        Status: "Processing",
        mainImageUrl: imageUrl,
        metaData: JSON.stringify(metadata),
        processedImages: "",
      },
    });

    return image;
  };

  public addRandomImage = (req: Request, res: Response) => {
    const architectureType = req.body.architectureType || "request-driven";
    // hardcoded for tutorial purpose
    const client = createClient("563492ad6f9170000100000157a70d9a9074477eaf0c5c41e4755a25");
    let randomPhoto: any = undefined;

    const randomPage = Math.floor(Math.random() * 5);

    client.photos
      .search({
        page: randomPage,
        per_page: 10,
        query: "Nature",
      })
      .then((photos: any) => {
        randomPhoto = photos.photos[randomPage];

        // save image to database

        const imageOriginalUrl = randomPhoto.src.original;
        randomPhoto.src = {};
        randomPhoto.extension = `${
          imageOriginalUrl.split(".")[imageOriginalUrl.split(".").length - 1]
        }`;

        this.saveImageToDatabase(randomPhoto, imageOriginalUrl).then(
          (imageData) => {
            this.handleRequestByArchtecture(
              architectureType,
              imageData,
              imageOriginalUrl,
              res
            );
          }
        );
      });
  };

  public getProcessedImagesFromNetwork = (
    imageString: string,
    image: Image,
    res: Response
  ) => {
    axios
      .post("http://localhost:3001/process-image", {
        imageUrl: imageString,
        imageId: image.id,
        imageExtension: JSON.parse(image.metaData).extension,
      })
      .then((response: any) => {
        this.saveProcessedImages(response.data, image.id.toString()).then(
          (image) => {
            res.json(image);
          }
        );
      }).catch(() => {
        this.updateFailedProcess(image.id.toString(), res)
      });
  };

  public updateFailedProcess = (imageId: string, res: Response) => {

    this.prisma.image.update({
      where: {
        id: parseInt(imageId),
      },
      data: {
        Status: "Failed",
      },
    }).then((image) => {
      res.json(image);
    });

  }

  public saveProcessedImages = (
    processedImageUrl: string[],
    imageId: string
  ) => {
    // update image data in database

    return this.prisma.image.update({
      where: {
        id: parseInt(imageId),
      },
      data: {
        processedAt: new Date(),
        processedImages: JSON.stringify(processedImageUrl),
        Status: "Completed",
      },
    });
  };

  public uploadImageToFile = (req: Request, res: Response) => {
    const image = req.body.image;
    const imageId = req.body.imageId;
    const imageExtension = req.body.imageExtension;

    const imageName = `${imageId}.${imageExtension}`;

    // save to disk
    fs.writeFile(
      "public/images/" + imageName,
      Buffer.from(image, "base64"),
      (err) => {
        // console.log(err);
      }
    );

    res.send("image uploaded");
  };

  public handleRequestByArchtecture = (
    architectureType: string,
    imageData: Image,
    imageUrl: string,
    res: Response
  ) => {
    if (architectureType == "request-driven") {
      // process image
      this.getProcessedImagesFromNetwork(imageUrl, imageData, res);
    } else if(architectureType == "event-driven") {
       // process image 
    }
  };

  public getAllImages = (req: Request, res: Response) => {
    this.prisma.image.findMany().then((allImages) => {
      res.json(allImages);
    });
  };


}
