<template>

  <div
    class="h-full w-full text-center flex text-sm flex-col relative top-0 left-0 text-gray-700 overflow-y-auto overflow-x-hidden"
    style="
    background: rgb(238,174,202);
background: linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%);
    "
  >
    <div class="bg-white py-2 grid w-full grid-cols-12 sticky top-0 left-0">
      <div
        class="lg:!col-start-2 flex flex-row items-center justify-between lg:!col-end-12 col-span-full py-3"
      >
        <h1 class="text-xl font-extrabold">ImageMulticolor</h1>
        <div class="flex flex-row items-center space-x-2">
          <span> Architecture type </span>
          <div class="px-3 border-[1px] bg-white border-gray-200 rounded-md">
            <select
              name="architectures"
              id="architecture-types"
              class="py-2 bg-white focus:outline-none"
              v-model="architectureType"
            >
              <option value="request-driven">Request-Driven</option>
              <option value="event-driven">Event-Driven (Kafka)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class=" py-2 overflow-y-hidden grid w-full grid-cols-12 overflow-x-hidden">
      <slot />
    </div>
    
  </div>
</template>
<script lang="ts">
import { architectureType } from '../composables';

export default {
  name: "DashboardLayout",
  setup() {
   return{
     architectureType
   }
  },
};
</script>
<style>
body {
   background: rgb(238,174,202);
background: linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%);
}
</style>