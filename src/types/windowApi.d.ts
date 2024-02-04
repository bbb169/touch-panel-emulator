import { PreloadAPITypes } from 'src/types'

declare global {
  interface Window {
    api: PreloadAPITypes // 这里定义 api 属性的类型为一个接受无参数并返回 void 的函数
  }
}
