import React, { useState } from 'react'
import { Button, Card, DatePicker, Form, Input, message, Popconfirm, Select, Space, Table, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useGetArticles, deleteArticle } from '@/apis/article'
import { useGetTags } from '@/apis/tag'
import { EditOutlined, DeleteOutlined, PlusOutlined, CheckCircleTwoTone, StarTwoTone } from '@ant-design/icons'

import { IArticleItem, IArticleQuery } from '@/interfaces/article'
import { debounce } from '@/utils/function'
import moment from 'moment'

const { Column } = Table
const { Option } = Select
const { RangePicker } = DatePicker

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
    const { title, publish_status, tag, publish_time } = form.getFieldsValue()
    const body = {
      title,
      publish_status,
      publish_time_start: publish_time && moment(publish_time[0]).startOf('date').format('YYYY-MM-DD HH:mm:ss'),
      publish_time_end: publish_time && moment(publish_time[1]).endOf('date').format('YYYY-MM-DD HH:mm:ss'),
      tag: tag && tag.length ? tag.join(',') : undefined,
    }
    setQuery(body)
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
          <Input placeholder="Title" style={{ width: 200 }} onChange={debounce(onChangeQuery)} />
        </Form.Item>
        <Form.Item name="publish_time">
          <RangePicker
            placeholder={['Publish Time Start', 'Publish Time End']}
            style={{ width: 320 }}
            onChange={debounce(onChangeQuery, 1000)}
          ></RangePicker>
        </Form.Item>
        <Form.Item name="publish_status">
          <Select placeholder="Publish Status" style={{ width: 200 }} allowClear onChange={debounce(onChangeQuery)}>
            <Option value="publish">Published</Option>
            <Option value="saveToDraft">Draft</Option>
          </Select>
        </Form.Item>
        <Form.Item name="tag">
          <Select
            maxTagCount={2}
            mode="multiple"
            allowClear
            placeholder="Tag"
            style={{ width: 240 }}
            onChange={debounce(onChangeQuery)}
          >
            {tagList && tagList.map((_: any) => <Option key={_.tag_name} value={_.tag_name} children={undefined}></Option>)}
          </Select>
        </Form.Item>
      </Form>
      <Table loading={isLoading} dataSource={articleList} rowKey="article_id">
        <Column title="Title" dataIndex="title"></Column>
        <Column title="Author" dataIndex="author"></Column>
        <Column title="Slug" dataIndex="url"></Column>
        <Column title="Description" width={180} dataIndex="description" ellipsis></Column>
        <Column
          title="Tag"
          dataIndex="tag"
          ellipsis
          render={(record) =>
            record.map((_: string, index: number) => (
              <Tag key={index} style={{ marginBottom: 3 }} color="geekblue">
                {_}
              </Tag>
            ))
          }
        ></Column>
        <Column width={180} title="Publish Time" dataIndex="publish_time"></Column>
        <Column
          title="Publish Status"
          dataIndex="publish_status"
          render={(record) => {
            return (
              <>
                {record === 'publish' && (
                  <>
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                    <span> Published </span>
                  </>
                )}
                {record === 'saveToDraft' && (
                  <>
                    <StarTwoTone />
                    <span> Draft </span>
                  </>
                )}
              </>
            )
          }}
        ></Column>
        <Column
          title="Action"
          key="action"
          width={110}
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
