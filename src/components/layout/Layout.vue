<template>
  <div class="app-wrapper">
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <layout-content></layout-content>
  </div>
</template>
<script>
import LayoutHeader from './LayoutHeader.vue';
import LayoutSidebar from './LayoutSidebar.vue';
import LayoutContent from './LayoutContent.vue';
export default {
  name: "",
  data: () => ({

  }),
  components:{
    LayoutHeader,
    LayoutSidebar,
    LayoutContent
  }
}
</script>
<style lang="scss" scoped>
</style>
