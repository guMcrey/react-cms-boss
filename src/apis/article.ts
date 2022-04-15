import useSWR from 'swr'
import { axios } from '@/utils/axios'
import { IArticleCreate, IArticleQuery } from '@/interfaces/article'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())
const queryFetcher = (url: string, query?: IArticleQuery) => axios.get(url, { params: query }).then((data) => data.data)

// get article list
export const useGetArticles = (query?: IArticleQuery) => {
  const { data, error, mutate } = useSWR([`/articles`, query], queryFetcher)
  return {
    articleList: data && data.result,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

// get article by id
export const useGetArticleDetailById = (id?: string | null) => {
  const [data, setData] = useState(undefined)
  const fetchData = async () => {
    try {
      if (!id) {
        return
      }
      const { data } = await axios.get(`/articles/${id}`)
      setData(data.result)
    } catch (e) {
      console.warn(e)
    }
  }

  return {
    articleInfo: data,
    fetchData,
  }
}

// create article
export const createArticle = async (form: IArticleCreate) => {
  let result = undefined
  try {
    const { title, author, url, content, description, publishStatus, publishTime, tag } = form
    const { data } = await axios.post('/articles', {
      title,
      url,
      content,
      description,
      publish_status: publishStatus,
      publish_time: publishTime,
      tag,
      author,
    })
    result = data
  } catch (e) {
    console.warn(e)
  }

  return result
}

// update article info
export const updateArticle = async (id: string, form: IArticleCreate) => {
  let result = undefined
  try {
    const { title, author, url, content, description, mainPicture, publishStatus, publishTime, tag } = form
    const { data } = await axios.put(`/articles/${id}`, {
      title,
      url,
      content,
      description,
      publish_status: publishStatus,
      publish_time: publishTime,
      tag,
      author,
    })
    result = data
  } catch (e) {
    console.warn(e)
  }

  return result
}

// delete article
export const deleteArticle = async (id: string) => {
  let result = undefined
  try {
    const { data } = await axios.delete(`/articles/${id}`)
    result = data
  } catch (e) {
    console.warn(e)
  }

  return result
}

// upload article main picture
export const uploadArticleMainPicture = async (articleId: string, img: FormData) => {
  let uploadResult = undefined
  try {
    const { data } = await axios.put(`/upload/article-img/${articleId}`, img, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    uploadResult = data
  } catch (e) {
    console.warn(e)
  }

  return uploadResult
}

// delete article content images
export const deleteContentImages = async (images: string[]) => {
  let deleteResult = undefined
  try {
    const { data } = await axios.patch(`/upload/article-content-img`, {
      delete_images: images,
    })
    deleteResult = data
  } catch (e) {
    console.warn(e)
  }
  return deleteResult
}
