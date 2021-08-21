<template>
  <div class="hello">
    <div>
      <div>
        <button @click="run">retry</button>
        <button @click="competitionRequest">竞态测试</button>
        <div>
          <button @click="cancelRequest.start">取消请求-开始</button>
          <button @click="cancelRequest.cancel">取消请求-取消</button>
        </div>
        <div>
          <h1>消抖测试</h1>
          <input @input="handleInput"/>
        </div>
      </div>
      <span v-if="loading">loading...</span>
      <span v-else>{{ result }}</span>
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
      const { data: result, loading, run, cancel } = useRequest(
        (v: string,t:number) => mockRequest(v,t),
        {
          initialData: '默认',
          manaul: true,
          debounceInterval: 500,
          // pollingInterval: 4000
        }
      );
      
      let requestIdx = 0
      let time = 4000
      const competitionRequest = () => {
        requestIdx++;
        run(`competitionRequest${requestIdx}`,time)
        time = time / 2
      }

      const cancelRequest = () => {
        return {
          start: () => run('取消请求测试',3000),
          cancel: cancel,
        }
      }

      const handleInput = (e:{target: {value: string}}) => {
        console.log(e.target.value);
        run(e.target.value,200)
        // run('',200)
      }

      return {
        result,
        loading,
        run,
        competitionRequest,
        cancelRequest:cancelRequest(),
        handleInput
      };
    },
  });
</script>
