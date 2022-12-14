import { AxiosResponse } from "axios";
import { ReadOnlyApiService } from "./common/ReadOnlyService";

export class ImageApiService extends ReadOnlyApiService {
  constructor() {
    // this is equivalent to your base_url/sample
    super("images");
  }

  public async addRandomImage(
    data = {}
  ): Promise<AxiosResponse<unknown, unknown>> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(
        this.getUrl() + "/random",
        data
      );

      return response;
    } catch (err) {
      this.handleErrors(err);
      // you can handle request specific error here
      throw err;
    }
  }

  public async processUploadedImage(
    data: FormData
  ): Promise<AxiosResponse<unknown, unknown>> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(
        this.getUrl() + "/process",
        data,
        {
          headers: {
            "content-type" : "multipart/form-data"
          }
        }
      );

      return response;
    } catch (err) {
      this.handleErrors(err);
      // you can handle request specific error here
      throw err;
    }
  }
}
