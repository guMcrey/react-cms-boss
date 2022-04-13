import React, { useState } from 'react'
import { Button, Card, DatePicker, Form, Input, message, Popconfirm, Select, Space, Table, Tabs, Tag, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useGetArticles, deleteArticle } from '@/apis/article'
import { useGetTags } from '@/apis/tag'
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleTwoTone,
  StarTwoTone,
  CopyOutlined,
  CheckOutlined,
} from '@ant-design/icons'

import { IArticleItem, IArticleQuery } from '@/interfaces/article'
import { debounce } from '@/utils/function'
import moment from 'moment'
import ClipboardJS from 'clipboard'

new ClipboardJS('#copySlug')
const { Column } = Table
const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs
let publishStatus = 'publish'

export const ArticleList = () => {
  const [query, setQuery] = useState<IArticleQuery | undefined>({ publish_status: publishStatus })
  const [copied, setCopied] = useState(false)
  const [currentId, setCurrentId] = useState(0)
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
    const { article_id, url, title, tag, publish_time } = form.getFieldsValue()
    const body = {
      article_id: article_id && article_id.trim(),
      url: url && url.trim(),
      title: title && title.trim(),
      publish_status: publishStatus,
      publish_time_start: publish_time && moment(publish_time[0]).startOf('date').format('YYYY-MM-DD HH:mm:ss'),
      publish_time_end: publish_time && moment(publish_time[1]).endOf('date').format('YYYY-MM-DD HH:mm:ss'),
      tag: tag && tag.length ? tag.join(',') : undefined,
    }
    setQuery(body)
  }

  const tabChangeHandler = async (key: string) => {
    publishStatus = key
    onChangeQuery()
  }

  return (
    <Card
      title="Article List"
      extra={
        <Button
          style={{ position: 'absolute', top: 16, left: 115 }}
          type="primary"
          shape="circle"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => jumpToArticleForm()}
        ></Button>
      }
    >
      <Tabs defaultActiveKey="publish" onChange={tabChangeHandler}>
        <TabPane
          tab={
            <span>
              <CheckCircleTwoTone twoToneColor="#52c41a" />
              Published
            </span>
          }
          key="publish"
        ></TabPane>
        <TabPane
          tab={
            <span>
              <StarTwoTone />
              Draft
            </span>
          }
          key="saveToDraft"
        ></TabPane>
      </Tabs>
      <Form form={form} layout="inline" style={{ marginBottom: 15 }}>
        <Form.Item name="article_id">
          <Input placeholder="Article ID" allowClear onChange={debounce(onChangeQuery)}></Input>
        </Form.Item>
        <Form.Item name="url">
          <Input placeholder="Slug" allowClear onChange={debounce(onChangeQuery)}></Input>
        </Form.Item>
        <Form.Item name="title">
          <Input placeholder="Title" allowClear onChange={debounce(onChangeQuery)} />
        </Form.Item>
        <Form.Item name="publish_time">
          <RangePicker
            placeholder={['Publish Time Start', 'Publish Time End']}
            style={{ width: 297 }}
            onChange={debounce(onChangeQuery, 1000)}
          ></RangePicker>
        </Form.Item>
        <Form.Item name="tag">
          <Select
            maxTagCount={2}
            mode="multiple"
            allowClear
            placeholder="Tag"
            style={{ width: 195 }}
            onChange={debounce(onChangeQuery)}
          >
            {tagList && tagList.map((_: any) => <Option key={_.tag_name} value={_.tag_name} children={undefined}></Option>)}
          </Select>
        </Form.Item>
      </Form>
      <Table loading={isLoading} dataSource={articleList} rowKey="article_id">
        <Column title="Article ID" dataIndex="article_id" width={100}></Column>
        <Column title="Title" dataIndex="title"></Column>
        <Column title="Author" dataIndex="author"></Column>
        <Column
          title="Slug"
          dataIndex="url"
          render={(text, record: any) => (
            <>
              {record.article_id === currentId && <span id="slug">{text}</span>}
              {record.article_id !== currentId && <span>{text}</span>}
              {(!copied || record.article_id !== currentId) && (
                <Button
                  id="copySlug"
                  data-clipboard-target="#slug"
                  icon={<CopyOutlined />}
                  type="link"
                  size="small"
                  onClick={() => {
                    setTimeout(() => {
                      setCopied(false)
                      setCurrentId(0)
                    }, 2000)
                    setCopied(true)
                    setCurrentId(record.article_id)
                  }}
                />
              )}
              {copied && record.article_id === currentId && (
                <Tooltip defaultVisible title="copied!">
                  <Button type="link" size="small" icon={<CheckOutlined />}></Button>
                </Tooltip>
              )}
            </>
          )}
        ></Column>
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
