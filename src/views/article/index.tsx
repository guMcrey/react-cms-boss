import React, { useState } from 'react'
import { Button, Card, DatePicker, Form, Input, message, Popconfirm, Select, Space, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useGetArticles, deleteArticle } from '@/apis/article'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

import { IArticleItem, IArticleQuery } from '@/interfaces/article'
import { debounce } from '@/utils/function'

const { Column } = Table
const { Option } = Select

export const ArticleList = () => {
  const [query, setQuery] = useState<IArticleQuery | undefined>()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { articleList, isLoading, mutate } = useGetArticles(query)

  const jumpToArticleForm = (item?: IArticleItem): void => {
    if (item && item.article_id) {
      navigate(`/article-create?id=${item.article_id}`)
    } else {
      navigate(`/article-create`)
    }
  }

  const onDelete = async (item: IArticleItem) => {
    if (!item.article_id) {
      return
    }
    await deleteArticle(item.article_id)
    message.success('Delete success')
    mutate()
  }

  const onChangeQuery = () => {
    setQuery(form.getFieldsValue())
  }

  return (
    <Card
      title="Article List"
      extra={
        <Button icon={<PlusOutlined />} onClick={() => jumpToArticleForm()}>
          Create Article
        </Button>
      }
    >
      <Form form={form} layout="inline" style={{ marginBottom: 15 }}>
        <Form.Item name="title">
          <Input placeholder="Title" style={{ width: 200 }} onChange={debounce(onChangeQuery, 1000)} />
        </Form.Item>
        <Form.Item name="publish_time">
          <DatePicker style={{ width: 200 }} onChange={debounce(onChangeQuery, 1000)}></DatePicker>
        </Form.Item>
        <Form.Item name="publish_status">
          <Select placeholder="Publish Status" style={{ width: 200 }} onChange={debounce(onChangeQuery, 1000)}>
            <Option value="published">Published</Option>
            <Option value="un_published">UnPublished</Option>
          </Select>
        </Form.Item>
      </Form>
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
