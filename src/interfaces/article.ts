export interface IArticleItem {
  article_id?: string
  author?: string
  content?: string
  description?: string
  main_img?: string
  publish_status?: string
  publish_time?: string
  title?: string
  url?: string
  tag?: IArticleTag[]
}

export interface IArticleTag {
  name: string
}

export interface IArticleCreate {
  title?: string
  author?: string
  url?: string
  content?: string
  description?: string
  mainPicture?: string
  publishStatus?: string
  publishTime?: string
  tag?: IArticleTag[]
}

export interface IArticleQuery {
  title?: string
  publish_time?: string
  publish_status?: string
}
