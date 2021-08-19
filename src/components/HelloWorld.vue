<template>
  <div class="hello">
    <div>
      <span v-if="loading">loading...</span>
      <span v-else>{{ result }}</span>
      <button @click="run">retry</button>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent } from "@vue/composition-api";
  import { mockRequest } from "./utils";
  // import { useRequest } from "@/hooks";
  import useRequest from "@/hooks/use-request/duplicated";

  export default defineComponent({
    name: "HelloWorld",
    props: {
      msg: String,
    },
    // data() {
    //   return {
    //     result: '',
    //     loading: false
    //   }
    // },
    // async created() {
    //   this.loading = true
    //   this.result = await mockRequest('duruomeng')
    //   this.loading = false
    // }
    setup() {
      const { data: result, loading, run } = useRequest(
        (val: string,t:number) => mockRequest("ava"),
        {
          initialData: '默认',
          // manaul: true,
          pollingInterval:5000
        }
      );
      return {
        result,
        loading,
        run
      };
    },
  });
</script>
