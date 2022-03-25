import React, { useEffect, useState } from 'react'
import { Button, Card, DatePicker, Form, Input, message, Select, Space, Tag, Upload } from 'antd'
import { createArticle, uploadArticleMainPicture } from '@/apis/article'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetArticleDetailById, updateArticle } from '@/apis/article'
import { IArticleCreate } from '@/interfaces/article'
import { EditOutlined, CheckOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import moment from 'moment'

const { Option } = Select

export const CreateArticle = () => {
  const [username, setUsername] = useState('hakuna')
  const [editUsernameVisible, setEditUsernameVisible] = useState(false)
  const [fileList, setFileList]: any = useState()
  const [tagInputVisible, setTagInputVisible] = useState(false)
  const [tags, setTags] = useState([])
  const [tagInputValue, setTagInputValue] = useState(undefined)
  const [submitLoading, setSubmitLoading] = useState(false)

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

  const mainPictureProps: any = {
    onRemove: (file: never) => {
      return setFileList(null)
    },
    beforeUpload: (file: never) => {
      setFileList(file)
      return false
    },
  }

  const handleEditAuthor = () => {
    setEditUsernameVisible(true)
    if (!form.getFieldValue('author')) {
      form.setFieldsValue({ author: username })
    }
  }

  const handleChangeAuthor = () => {
    setEditUsernameVisible(false)
    if (!form.getFieldValue('author')) {
      setUsername('hakuna')
      return
    }
    setUsername(form.getFieldValue('author'))
  }

  const generateSlugHandler = () => {
    // TODO:
  }

  const handleInputChange = (e: any) => {
    setTagInputValue(e.target.value)
  }

  const handleInputConfirm = () => {
    if (tagInputValue && tags.indexOf(tagInputValue) === -1) {
      setTags([...tags, tagInputValue])
    }
    setTagInputVisible(false)
    setTagInputValue(undefined)
  }

  const handleTagClose = (removedTag: string) => {
    const curTags = tags.filter((tag: string) => tag !== removedTag)
    setTags(curTags)
  }

  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable
        color="geekblue"
        onClose={(e) => {
          e.preventDefault()
          handleTagClose(tag)
        }}
      >
        {tag}
      </Tag>
    )

    return <span key={tag}>{tagElem}</span>
  }

  const tagChild = tags.map(forMap)

  const onFinish = async (values: IArticleCreate) => {
    const { title, url, content, description, publishStatus, publishTime } = values
    const body = {
      title,
      url,
      author: username,
      content,
      description,
      mainPicture: fileList,
      publishStatus,
      publishTime: moment(publishTime).format('YYYY-MM-DD HH:mm:ss'),
      tag: tags,
    }

    setSubmitLoading(true)
    // edit
    if (currentId) {
      const result = await updateArticle(currentId, body)
      if (result !== undefined) {
        message.success('Update success')
        navigate('/articles')
      }
      return
    }
    // create
    if (!currentId) {
      const result = await createArticle(body)

      // 上传 main img
      if (fileList) {
        const formDataBody = new FormData()
        formDataBody.append('main_img', fileList)
        const uploadResult = await uploadArticleMainPicture(result.articleId, formDataBody)
        if (!uploadResult.filename) {
          message.error('Create failed')
          return
        }
      }

      if (result !== undefined) {
        message.success('Create success')
        navigate('/articles')
      }
      return
    }
    setSubmitLoading(false)
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
      <Form
        {...layout}
        initialValues={{ publishTime: moment(new Date(), 'YYYY-MM-DD HH:mm:ss') }}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input placeholder="e.g. HTML Basic" onChange={generateSlugHandler} />
        </Form.Item>
        <Form.Item label="Author">
          {!editUsernameVisible && (
            <CreateWrapper>
              <Form.Item name="author">
                <span style={{ marginRight: 8 }}>{username}</span>
              </Form.Item>
              <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={handleEditAuthor} />
            </CreateWrapper>
          )}
          {editUsernameVisible && (
            <CreateWrapper>
              <Form.Item name="author" className="author-input">
                <Input placeholder="Author" onPressEnter={handleChangeAuthor} />
              </Form.Item>
              <Button type="primary" shape="circle" icon={<CheckOutlined />} onClick={handleChangeAuthor} />
            </CreateWrapper>
          )}
        </Form.Item>
        <Form.Item label="Slug" name="url">
          <Input placeholder="e.g. html-basic" />
        </Form.Item>
        <Form.Item label="Main Picture">
          <Upload listType="picture" {...mainPictureProps} maxCount={1}>
            <Button icon={<UploadOutlined />}>Select main picture</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea showCount maxLength={500} rows={4} placeholder="Please enter article description..." />
        </Form.Item>
        <Form.Item label="Content" name="content">
          <TextArea rows={4} placeholder="Please enter article content..." />
        </Form.Item>
        <Form.Item label="Publish time" name="publishTime">
          <DatePicker showTime style={{ width: '100%' }} placeholder="Select publish time" />
        </Form.Item>
        <Form.Item label="Publish status" name="publishStatus">
          <Select placeholder="Select publish status">
            <Option value="published">Publish</Option>
            <Option value="to draft">Save to draft</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Tag">
          {tagChild}
          {tagInputVisible && (
            <Input style={{ width: 100 }} type="text" onChange={handleInputChange} onPressEnter={handleInputConfirm} />
          )}
          {!tagInputVisible && (
            <Tag color="#4047F4" onClick={() => setTagInputVisible(true)}>
              <PlusOutlined />
              &nbsp;New Tag
            </Tag>
          )}
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Submit
            </Button>
            <Button onClick={onReset}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

const CreateWrapper = styled.div`
  display: flex;
  .author-input {
    width: 100%;
    margin-right: 7px;
  }
`
