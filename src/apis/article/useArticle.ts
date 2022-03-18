import useSWR, { useSWRConfig } from 'swr'
import { axios } from '@/utils/axios'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// get article list
export const useGetArticles = () => {
  const { data, error } = useSWR(`/api/articles`, fetcher)

  return {
    articleList: data && data.result,
    isLoading: !error && !data,
    isError: error,
  }
}

// create article
export const requestCreateArticle = async (form: any) => {
  let result = undefined
  try {
    const { title, url, content, description, mainPicture, publishStatus, publishTime, tag } = form
    const { data } = await axios.post('/articles', {
      title,
      url,
      content,
      description,
      main_picture: mainPicture,
      publish_status: publishStatus,
      publish_time: publishTime,
      tag,
    })
    result = data
  } catch (e) {
    console.warn(e)
  }

  return result
}
