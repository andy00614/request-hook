<template>
  <div class="hello">
     <el-pagination
        layout="prev, pager, next"
        :total="50">
    </el-pagination>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "@vue/composition-api";
  import { Pagination } from 'element-ui'

  export default defineComponent({
    name: "HelloWorld",
    components: {
        ElPagination: Pagination
    },
    props: {
      msg: String,
    },
    setup() {
        return {

        }
    },
  });
</script>
