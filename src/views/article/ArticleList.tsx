import React from 'react'
import { useSWRConfig } from 'swr'
import { Button, Card, message, Popconfirm, Space, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useGetArticles, deleteArticle } from '@/apis/article/useArticle'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

const { Column } = Table

export const ArticleList = () => {
  const { mutate } = useSWRConfig()

  const navigate = useNavigate()
  const { articleList, isLoading } = useGetArticles()

  // TODO: TS interface
  const jumpToArticleForm = (item: any): void => {
    navigate(`/article-create?id=${item.article_id}`)
  }

  const onDelete = async (item: any) => {
    await deleteArticle(item.article_id)
    message.success('Delete success')
    mutate('/api/articles')
  }

  return (
    <Card
      title="Article List"
      extra={
        <Button icon={<PlusOutlined />} onClick={jumpToArticleForm}>
          Create Article
        </Button>
      }
    >
      <Table loading={isLoading} dataSource={articleList}>
        <Column title="Title" dataIndex="title" key="title"></Column>
        <Column title="Author" dataIndex="author" key="author"></Column>
        <Column title="URL" dataIndex="url" key="url"></Column>
        <Column title="Description" dataIndex="description" key="description"></Column>
        <Column title="Tag" dataIndex="tag" key="tag"></Column>
        <Column title="Publish Time" dataIndex="publish_time" key="publish_time"></Column>
        <Column title="Publish Status" dataIndex="publish_status" key="publish_status"></Column>
        <Column
          title="Action"
          key="action"
          render={(record) => (
            <Space size="small">
              <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => jumpToArticleForm(record)} />
              <Popconfirm title="Sure to delete?" onConfirm={() => onDelete(record)}>
                <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          )}
        ></Column>
      </Table>
    </Card>
  )
}
