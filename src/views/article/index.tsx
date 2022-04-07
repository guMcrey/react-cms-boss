import React, { useState } from 'react'
import { Button, Card, DatePicker, Form, Input, message, Popconfirm, Select, Space, Table, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useGetArticles, deleteArticle } from '@/apis/article'
import { useGetTags } from '@/apis/tag'
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
  const { tagList, isTagLoading, mutateTag } = useGetTags()

  const jumpToArticleForm = (item?: IArticleItem): void => {
    if (item && item.article_id) {
      navigate(`/article-create-editor?id=${item.article_id}`)
    } else {
      navigate(`/article-create-editor`)
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

  const handleTagChange = (selectedItems: string[]) => {
    console.log(selectedItems)
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
            <Option value="publish">Published</Option>
            <Option value="saveToDraft">Draft</Option>
          </Select>
        </Form.Item>
        <Form.Item name="tag">
          <Select maxTagCount={2} mode="multiple" allowClear placeholder="Tag" style={{ width: 240 }} onChange={handleTagChange}>
            {tagList && tagList.map((_: any) => <Option key={_.tag_name} value={_.tag_name} children={undefined}></Option>)}
          </Select>
        </Form.Item>
      </Form>
      <Table loading={isLoading} dataSource={articleList} rowKey="article_id">
        <Column title="Title" dataIndex="title"></Column>
        <Column title="Author" dataIndex="author"></Column>
        <Column title="Slug" dataIndex="url"></Column>
        <Column title="Description" dataIndex="description"></Column>
        <Column
          title="Tag"
          dataIndex="tag"
          render={(record) => record.map((_: string) => <Tag color="geekblue">{_}</Tag>)}
        ></Column>
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
