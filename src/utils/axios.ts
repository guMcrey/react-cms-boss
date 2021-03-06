import axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios'

export interface IAxiosResponse<T> extends AxiosResponse {
  code: number
  data: T
  msg: string
}

const instance = axios.create({
  baseURL: '/api',
  timeout: 60000,
})

const requestInterceptor = (config: AxiosRequestConfig) => {
  return config
}
const responseInterceptor = (response: AxiosResponse<IAxiosResponse<any>>) => {
  return response
}

instance.interceptors.request.use(requestInterceptor)
instance.interceptors.response.use(responseInterceptor)

export { instance as axios }
