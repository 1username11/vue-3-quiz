import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { parseDynamicKeys } from '../helpers'

const requestInterceptor = async (requestConfig: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  if (requestConfig.url) {
    requestConfig.url = parseDynamicKeys(requestConfig.url, requestConfig.dynamicKeys as TIndexedObject | undefined)
  }

  return requestConfig
}

const requestErrorInterceptor = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error)
}

export {
  requestInterceptor,
  requestErrorInterceptor
}
