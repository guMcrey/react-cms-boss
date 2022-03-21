import React from 'react'
import { Button, Card, message, Popconfirm, Space, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useGetArticles, deleteArticle } from '@/apis/article'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

const { Column } = Table

export const ArticleList = () => {
  const navigate = useNavigate()
  const { articleList, isLoading, mutate } = useGetArticles()

  // TODO: TS interface
  const jumpToArticleForm = (item: any): void => {
    if (item.article_id) {
      navigate(`/article-create?id=${item.article_id}`)
    } else {
      navigate(`/article-create`)
    }
  }

  const onDelete = async (item: any) => {
    await deleteArticle(item.article_id)
    message.success('Delete success')
    mutate()
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
      <Table loading={isLoading} dataSource={articleList} rowKey="article_id">
        <Column title="Title" dataIndex="title"></Column>
        <Column title="Author" dataIndex="author"></Column>
        <Column title="URL" dataIndex="url"></Column>
        <Column title="Description" dataIndex="description"></Column>
        <Column title="Tag" dataIndex="tag"></Column>
        <Column title="Publish Time" dataIndex="publish_time"></Column>
        <Column title="Publish Status" dataIndex="publish_status"></Column>
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
