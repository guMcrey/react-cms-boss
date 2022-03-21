import useSWR from 'swr'
import { axios } from '@/utils/axios'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// get article list
export const useGetArticles = () => {
  const { data, error, mutate } = useSWR(`/api/articles`, fetcher)

  return {
    articleList: data && data.result,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

// get article by id
export const useGetArticleDetailById = (id: string) => {
  const { data, error } = useSWR(`/api/articles/${id}`, fetcher)

  return {
    articleInfo: data && data.result,
    isLoading: !error && !data,
    isError: error,
  }
}

// create article
export const createArticle = async (form: any) => {
  let result = undefined
  try {
    const { title, author, url, content, description, mainPicture, publishStatus, publishTime, tag } = form
    const { data } = await axios.post('/articles', {
      title,
      url,
      content,
      description,
      main_img: mainPicture,
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
export const updateArticle = async (id: string, form: any) => {
  let result = undefined
  try {
    const { title, author, url, content, description, mainPicture, publishStatus, publishTime, tag } = form
    const { data } = await axios.put(`/articles/${id}`, {
      title,
      url,
      content,
      description,
      main_img: mainPicture,
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
