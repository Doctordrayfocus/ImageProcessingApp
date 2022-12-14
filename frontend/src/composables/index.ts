import { $api } from "@/services/api"
import { ref } from "vue"
import { io } from "socket.io-client"

interface ImageData {
  id: number;
    Status: string;
    metaData: string;
    mainImageUrl: string;
    imageExtension: string | null;
    createdAt: Date;
    processedAt: Date | null;
    processedImages: string[];
}

const webSocket = io("http://localhost:3000");



export const architectureType = ref<string>("request-driven")

export const allImages = ref<ImageData[]>()

export const loadingRandomImage = ref(false)
export const processingUploadedImage = ref(false)

webSocket.on("image-status" , (data) => {
    allImages.value?.forEach((image) => {
       if(image.id == parseInt(data.imageId)) {
         image.Status = data.status
         image.processedImages = data.processedImages
       }
    })
})

export const getImages = () => {
  $api.image.fetch().then((response) => {
     allImages.value = response.data.map((imageData: any) => {
      imageData.processedImages =  imageData.processedImages ? JSON.parse(imageData.processedImages) : []
      return imageData
     }).reverse()
  })
}

export const addRandomImage = () => {
 
  
  $api.image.addRandomImage({
    architectureType: architectureType.value
  }).then((response: any) => {
    response.data.processedImages = response.data.processedImages ? JSON.parse(response.data.processedImages) : []
    allImages.value?.unshift(response.data)
     
  })
}

export const uploadAndProcessImage = (data: FormData) => {
  
  $api.image.processUploadedImage(data).then((response: any) => {
    response.data.processedImages = response.data.processedImages ? JSON.parse(response.data.processedImages) : []
    allImages.value?.unshift(response.data)
  })
}
