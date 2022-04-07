import useSWR from 'swr'
import { axios } from '@/utils/axios'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// get tag list
export const useGetTags = () => {
  const { data, error, mutate } = useSWR(`/api/tags`, fetcher)
  return {
    tagList: data && data.result,
    isTagLoading: !error && !data,
    isError: error,
    mutateTag: mutate,
  }
}
