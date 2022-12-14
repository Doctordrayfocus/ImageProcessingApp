<template>
  <div class="py-3 lg:!col-start-2 h-auto lg:!col-end-12 col-span-full flex flex-col  overflow-y-hidden justify-center items-center">
    <div class="w-full bg-white py-6 px-6 rounded-xl shadow-md  h-[160px]">
      <div class="w-full flex cursor-pointer flex-row border-[2px] items-center relative justify-center h-full border-gray-300 border-dashed rounded-md">
        <span class="text-xl font-semibold text-gray-600">
          Upload Image
        </span>
         <input
          type="file"
          style="
            opacity: 0;
            width: 100%;
            height: 100%;
            left: 0;
            overflow: hidden;
            position: absolute;
            z-index: 10;
          "
          accept="image/*"
          @change="uploadHandler"
        />
      </div>
    </div>
    <div class="w-full flex flex-row items-center justify-between py-4 ">
      <h2 class="font-extrabold text-2xl text-white">
        All Images
      </h2>
      <button @click="addRandomImage()" class="focus:outline-none px-5 py-4 rounded-md  bg-[#9313e9] text-white font-semibold" >
        {{ loadingRandomImage ? 'Fetching Image...' : 'Add Random Image' }}
        </button>
    </div>

    
  </div>

  <div class="w-full col-start-2 col-end-13">
       <swiper
         :slides-per-view="'auto'"
      :space-between="18"
    :freeMode="true"
    :modules="modules"
    class="!pr-6"
  >
    <swiper-slide class="!w-[500px]" v-for="(image, index) in allImages" :key="index">
      <div class="w-[500px] h-[420px] bg-white flex flex-row space-y-2 rounded-xl shadow-xl ">
        <div class="w-[50%] h-[100%] relative rounded-tl-xl rounded-bl-xl bg-cover" 
        :style="`background-image: url(${image.mainImageUrl});`">
          <span :class="`px-3 py-1 rounded-3xl shadow-xl ${
            image.Status == 'Processing' ? 'bg-orange-400' : ''
          } ${
            image.Status == 'Completed' ? 'bg-green-400' : ''
          }
          ${
            image.Status == 'Failed' ? 'bg-red-400' : ''
          } 
          ${
            image.Status == 'In Queue' ? 'bg-blue-400' : ''
          }
          text-white absolute bottom-[4%] right-[4%]`">
            {{ image.Status }}
          </span>
        </div>
        <div class="w-[50%] h-full flex flex-col px-4 text-center items-center justify-center">
         
          <div class="h-full flex flex-col items-center justify-center  w-full">
             <h2 class="text-base font-semibold pb-3">Processed Images</h2>
            <div class="w-full grid grid-cols-2 gap-3">
            <div class="col-span-1 rounded-lg h-[90px] bg-cover" v-for="(processedImgUrl, index) in image.processedImages" :key="index" :style="`background-image: url(${processedImgUrl}); `" >
            </div>
            </div>
          
          </div>
        </div>
      </div>
    </swiper-slide>
  </swiper>
    </div>

</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useMeta } from "vue-meta";
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

// import required modules
import { FreeMode } from "swiper";
import {
  addRandomImage, getImages, allImages, architectureType, uploadAndProcessImage, loadingRandomImage
} from "../composables"

export default defineComponent({
  components:{
    Swiper,
    SwiperSlide
  },
  name: "Index",
  layout: "Dashboard",
  setup() {
    useMeta({
      title: "Home",
    });

   

     const uploadHandler = (e: any) => {
      const input = e.target;
      const imageFile = input.files[0];

      const formData = new FormData()

      formData.append('architectureType', architectureType.value),
      formData.append('image', imageFile)

      uploadAndProcessImage(formData)

      input.value = ''

    };

    onMounted(() => {
      getImages()
    })
    

    return {
      modules: [FreeMode],
      uploadHandler,
      addRandomImage,
      allImages,
      loadingRandomImage
    };
  },
});
</script>
