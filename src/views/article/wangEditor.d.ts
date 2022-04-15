import { SlateElement } from '@wangeditor/editor'

type ImageElement = SlateElement & {
  src: string
  alt: string
  url: string
  href: string
  children: any[]
  type?: string
  style?: any
}

type VideoElement = SlateElement & {
  src: string
}
