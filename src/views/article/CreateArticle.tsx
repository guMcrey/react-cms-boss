import { Button, Card, DatePicker, Form, Input, message, Space } from 'antd'
import { requestCreateArticle } from '@/apis/article/useArticle'
import { useNavigate } from 'react-router-dom'

export const CreateArticle = () => {
  const navigate = useNavigate()
  const { TextArea } = Input
  const [form] = Form.useForm()

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 24 },
  }

  const tailLayout = {
    wrapperCol: { offset: 2, span: 16 },
  }

  const onFinish = async (values: any) => {
    const result = await requestCreateArticle(values)
    if (result !== undefined) {
      message.success('Create success')
      navigate('/articles')
    }
  }

  return (
    <Card title="Create Article">
      <Form {...layout} form={form} onFinish={onFinish}>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input placeholder="HTML Basic" />
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
            <Button>Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}