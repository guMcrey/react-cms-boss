import React, { useEffect } from 'react'
import { Button, Card, DatePicker, Form, Input, message, Space } from 'antd'
import { createArticle } from '@/apis/article'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetArticleDetailById, updateArticle } from '@/apis/article'
import { IArticleItem } from '@/interfaces/article'

export const CreateArticle = () => {
  const navigate = useNavigate()
  const { TextArea } = Input
  const [form] = Form.useForm()
  let [params] = useSearchParams()
  const currentId = params.get('id')
  const { articleInfo, isLoading } = useGetArticleDetailById(currentId)

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 24 },
  }

  const tailLayout = {
    wrapperCol: { offset: 2, span: 16 },
  }

  const onFinish = async (values: IArticleItem) => {
    // edit
    if (currentId) {
      const result = await updateArticle(currentId, values)
      if (result !== undefined) {
        message.success('Update success')
        navigate('/articles')
      }
      return
    }
    // create
    if (!currentId) {
      const result = await createArticle(values)
      if (result !== undefined) {
        message.success('Create success')
        navigate('/articles')
      }
      return
    }
  }

  const onReset = () => {
    form.resetFields()
  }

  useEffect(() => {
    if (articleInfo && articleInfo.length) {
      const { title, author, url, main_img, description, content, publish_time, publish_status, tag } = articleInfo[0]
      form.setFieldsValue({
        title,
        url,
        author,
        mainPicture: main_img,
        description,
        content,
        // publishTime: publish_time,
        publishStatus: publish_status,
        tag,
      })
    }
  }, [articleInfo])

  return (
    <Card title="Create Article">
      <Form {...layout} form={form} onFinish={onFinish}>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input placeholder="HTML Basic" />
        </Form.Item>
        <Form.Item label="Author" name="author">
          <Input />
        </Form.Item>
        <Form.Item label="URL" name="url">
          <Input placeholder="/html-basic" />
        </Form.Item>
        {/* TODO */}
        <Form.Item label="Main Picture" name="mainPicture">
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea showCount maxLength={500} rows={4} placeholder="Please enter article description..." />
        </Form.Item>
        <Form.Item label="Content" name="content">
          <TextArea rows={4} placeholder="Please enter article content..." />
        </Form.Item>
        <Form.Item label="Publish Time" name="publishTime">
          <DatePicker disabled showTime />
        </Form.Item>
        <Form.Item label="Publish Status" name="publishStatus">
          <Input />
        </Form.Item>
        <Form.Item label="Tag" name="tag">
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={onReset}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}
