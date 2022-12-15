<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script lang="ts">
import AppLayoutDefault from "./AppLayoutDefault.vue";
import { shallowRef, watch } from "vue";
import { useRoute } from "vue-router";
import Dashboard from "./Dashboard.vue"

export default {
  name: "AppLayout",
  setup() {
    const layout = shallowRef(AppLayoutDefault);
    const route = useRoute();

    watch(
      () => route.meta,
      async (meta) => {
        try {
          let component: any =  AppLayoutDefault;
          if(meta.layout == 'Dashboard') component = Dashboard
          layout.value = component;
        } catch (e) {
          layout.value = AppLayoutDefault;
        }
      },
      { immediate: true }
    );
    return { layout };
  },
};
</script>
