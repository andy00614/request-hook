<template>
  <div class="hello">
    <div>
      <span v-if="loading">loading...</span>
      <span v-else>{{ result }}</span>
    </div>
    <div>
      <span v-if="loading">loading...</span>
      <span v-else>{{ result }}</span>
    </div>
    <div>
      <span v-if="loading">loading...</span>
      <span v-else>{{ result }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "@vue/composition-api";
import { mockRequest } from "./utils";
import { useRequest } from "@/hooks";

export default {
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
      (val: string) => mockRequest("duruomeng"),
      {}
    );
    return {
      result,
      loading,
    };
  },
};
</script>
