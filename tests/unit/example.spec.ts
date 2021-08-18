import fetchMock from 'jest-fetch-mock'
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import { useRequest } from '@/hooks'
Vue.use(VueCompositionAPI)

const request = async (): Promise<string> => {
  return fetch('https://google.com').then(res => res.json())
}

const wait = async(time:number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, time);
  })
}

const mockRequest = jest.fn((res) => new Promise((resolve) => {
  setTimeout(() => {
      resolve(res)
  }, 100);
}))

describe('HelloWorld.vue', () => {
  beforeEach(() => {
    // fetchMock.resetMocks()
    fetchMock.enableMocks()
    // fetchMock.doMock()
  })
  test('get return data', async() => {
    // fetchMock.mockResponses(JSON.stringify({ data: '12345' }))
    // const res = await mockRequest('xx')
    await wait(300)
    const { data } = useRequest(() => mockRequest('haha'))
    console.log(data)
    expect(data.value).toBe('12345')
  })
})
