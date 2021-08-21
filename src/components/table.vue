<template>
  <div class="hello">
      <input type="text" v-model="inputValue">
     <el-pagination
        :page-sizes="[10, 20, 50]"
        layout="sizes, prev, pager, next"
        v-bind="pagination"
        v-on="paginationEvent"
    >
    </el-pagination>
  </div>
</template>


<script lang="ts">
  import useRequest from "@/hooks/use-request/duplicated";
import { defineComponent, ref } from "@vue/composition-api";
  import { Pagination } from 'element-ui'

  const mockRequest = (params:any) => {
      const {count} = params
      return new Promise((resolve) => {
          setTimeout(() => {
              const list = []
              for(let i = 0; i < count; i++) {
                  list.push({
                      label: Math.random()
                  })
              }
              const result = {
                //   code: 0,
                //   data: {
                      list,
                      pageSize: 10,
                      total: count,
                      currentPage: 1
                //   },
                //   message:'success'
              }
              console.log('result',result,params)
              resolve(result)
          }, 200);
      })
      
  }

  export default defineComponent({
    name: "HelloWorld",
    components: {
        ElPagination: Pagination
    },
    props: {
      msg: String,
    },
    setup() {
        const inputValue = ref('')
        const request = (current:any,pageSize:any) => mockRequest(
            {
                currentPage: current,
                pageSize: pageSize,
                count:200,
            }
        )
        const {data,pagination,paginationEvent} = useRequest(request,{
            paginated: true,
            refreshDeps: [inputValue],
            debounceInterval:200
        })
        const handleOnCurrentChange = (...arr:any) => {
            console.log('handleOnCurrentChange',arr);
        }
        const handleOnSizeChange = (...arr:any) => {
            console.log('handleOnSizeChange',arr);
        }
        return {
            handleOnCurrentChange,
            handleOnSizeChange,
            data,
            pagination,
            paginationEvent,
            inputValue
        }
    },
  });
</script>
