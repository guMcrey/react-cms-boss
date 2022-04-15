import React, { useEffect, useState } from 'react'
import { Button, Card, DatePicker, Form, Input, message, Radio, Select, Space, Tag, Tooltip, Upload } from 'antd'
import { createArticle, uploadArticleMainPicture } from '@/apis/article'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetArticleDetailById, updateArticle, deleteContentImages } from '@/apis/article'
import { IArticleCreate } from '@/interfaces/article'
import { EditOutlined, CheckOutlined, UploadOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import moment from 'moment'
import { convertToUrl, debounce } from '@/utils/function'
import ClipboardJS from 'clipboard'

new ClipboardJS('#slugBtn')
const { Option } = Select

interface IProps {
  title: string
  description: string
  content: string
  insertedImgList: string[]
  insertedVideoList: string[]
  finallyImgList: any[] | null
  finallyVideoList: any[] | null
  getEditInfo: Function
}

export const CreateArticle = (props: Partial<IProps>) => {
  const [username, setUsername] = useState('hakuna')
  const [editUsernameVisible, setEditUsernameVisible] = useState(false)
  const [slugOptionValue, setSlugOptionValue] = useState('automatic')
  const [isCopied, setCopied] = useState(false)
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
  const { articleInfo, fetchData } = useGetArticleDetailById(currentId)

  const slugOptions = [
    { label: 'Automatic generate', value: 'automatic' },
    { label: 'Input by self', value: 'inputBySelf' },
  ]

  const mainPictureProps: any = {
    onRemove: (file: never) => {
      return setFileList(null)
    },
    beforeUpload: (file: any) => {
      setFileList([file])
      return false
    },
    fileList,
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

  const generateSlugHandler = (): void => {
    if (slugOptionValue === 'inputBySelf') {
      return
    }
    form.setFieldsValue({ url: convertToUrl(props.title ? props.title.trim() : '') })
  }

  const onChangeSlugOption = (e: any) => {
    setSlugOptionValue(e.target.value)
  }

  const handleInputChange = (e: any) => {
    setTagInputValue(e.target.value && e.target.value.trim())
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
        style={{ marginBottom: 8 }}
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

  const onFinish = async (values: IArticleCreate, publishType: string) => {
    // 获取 insertedImgList 和 finallyImgList 差集
    let insertImg = props.insertedImgList && new Set([...props.insertedImgList])
    let finalImg = props.finallyImgList && new Set([...props.finallyImgList.map((val) => val.src)])
    const difference = insertImg && new Set([...insertImg].filter((val) => finalImg && !finalImg.has(val)))
    const deleteResult = difference && (await deleteContentImages([...difference]))
    if (deleteResult.code !== 200) {
      message.error(`${deleteResult.message}`)
    }

    const { title, url, description, publishTime } = values
    const body = {
      title: title.trim(),
      url: url && url.trim(),
      author: username.trim(),
      content: props.content && props.content.trim(),
      description: description && description.trim(),
      mainPicture: fileList,
      publishStatus: publishType,
      publishTime: moment(publishTime).format('YYYY-MM-DD HH:mm:ss'),
      tag: tags,
    }

    setSubmitLoading(true)
    // edit
    if (currentId) {
      const result = await updateArticle(currentId, body)

      // 更新 main img
      if (fileList && fileList.length) {
        const formDataBody = new FormData()
        formDataBody.append('main_img', fileList[0])
        const uploadResult = await uploadArticleMainPicture(result.articleId, formDataBody)
        if (uploadResult.code !== 200) {
          message.error('Create failed')
          return
        }
      }

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
      if (fileList && fileList.length) {
        const formDataBody = new FormData()
        formDataBody.append('main_img', fileList[0])
        const uploadResult = await uploadArticleMainPicture(result.articleId, formDataBody)
        if (uploadResult.code !== 200) {
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

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  useEffect(() => {
    if (!articleInfo) {
      return
    }
    const { title, author, url, main_img, description, content, publish_time, tag } = articleInfo
    props.getEditInfo && props.getEditInfo(articleInfo)
    form.setFieldsValue({
      title,
      url,
      author,
      mainPicture: main_img,
      description,
      content,
      publishTime: moment(publish_time),
      tag,
    })
    if (main_img) {
      setFileList([
        {
          uid: '1',
          name: `${main_img}`,
          type: 'image/png',
          url: `http://localhost:3000/images/${main_img}`,
          thumbUrl: `http://localhost:3000/images/${main_img}`,
        },
      ])
    }
    setTags(tag)
  }, [articleInfo])

  useEffect(() => {
    form.setFieldsValue({
      title: props.title,
    })
    generateSlugHandler()
  }, [props.title])

  useEffect(() => {
    const descriptionDisplay = props.description ? props.description.slice(0, 300) : ''
    form.setFieldsValue({
      description: descriptionDisplay,
    })
  }, [props.description])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Card title="Variables">
      <Form layout="vertical" initialValues={{ publishTime: moment(new Date(), 'YYYY-MM-DD HH:mm:ss') }} form={form}>
        <Form.Item label="Title:" name="title" rules={[{ required: true }]}>
          <Input placeholder="e.g. HTML Basic" readOnly />
        </Form.Item>
        <Form.Item label="Author:">
          {!editUsernameVisible && (
            <CreateWrapper>
              <Form.Item name="author">
                <span style={{ marginRight: 8 }}>{username}</span>
              </Form.Item>
              <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={handleEditAuthor} size="small" />
            </CreateWrapper>
          )}
          {editUsernameVisible && (
            <CreateWrapper>
              <Form.Item name="author" className="author-input">
                <Input placeholder="Author" onPressEnter={handleChangeAuthor} />
              </Form.Item>
              <Button type="primary" shape="circle" icon={<CheckOutlined />} onClick={handleChangeAuthor} size="small" />
            </CreateWrapper>
          )}
        </Form.Item>
        <Form.Item style={{ margin: '-20px 0 0' }} label="Slug">
          <RadioWrapper
            options={slugOptions}
            onChange={onChangeSlugOption}
            value={slugOptionValue}
            optionType="button"
            size="small"
          />
          <Form.Item
            name="url"
            style={{ width: 'calc(100% - 34px)', position: 'relative' }}
            rules={[
              {
                validator: (rule, value, callback) => {
                  const regExp = new RegExp('^[A-Za-z0-9-]+$')
                  if (!regExp.test(value)) {
                    callback('Only letters, numbers and dashes are allowed')
                  }
                },
              },
            ]}
          >
            <Input id="slug" placeholder="e.g. html-basic" />
          </Form.Item>
          {!isCopied && (
            <ToolTipsWrapper title="">
              <Button
                id="slugBtn"
                data-clipboard-target="#slug"
                icon={<CopyOutlined />}
                onClick={() => {
                  setTimeout(() => {
                    setCopied(false)
                  }, 2000)
                  setCopied(true)
                }}
              />
            </ToolTipsWrapper>
          )}
          {isCopied && (
            <ToolTipsWrapper defaultVisible title="copied!">
              <Button icon={<CheckOutlined style={{ color: '#4047F4' }} />}></Button>
            </ToolTipsWrapper>
          )}
        </Form.Item>
        {fileList && (
          <Form.Item label="Main Picture" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload listType="picture" {...mainPictureProps} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select main picture</Button>
            </Upload>
          </Form.Item>
        )}
        {!fileList && (
          <Form.Item label="Main Picture" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload listType="picture" {...mainPictureProps} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select main picture</Button>
            </Upload>
          </Form.Item>
        )}
        <Form.Item label="Description" name="description">
          <TextArea showCount maxLength={300} rows={3} placeholder="Please enter article description..." />
        </Form.Item>
        <Form.Item label="Publish time" name="publishTime">
          <DatePicker showTime style={{ width: '100%' }} placeholder="Select publish time" />
        </Form.Item>
        <Form.Item label="Tag">
          {tagChild}
          {tagInputVisible && (
            <Input
              style={{ width: 100 }}
              type="text"
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          )}
          {!tagInputVisible && (
            <Tag color="#4047F4" onClick={() => setTagInputVisible(true)}>
              <PlusOutlined />
              &nbsp;New Tag
            </Tag>
          )}
        </Form.Item>
        <BtnWrapper>
          <Button onClick={() => onFinish(form.getFieldsValue(), 'saveToDraft')} block>
            Save to draft
          </Button>
          <Button type="primary" loading={submitLoading} block onClick={() => onFinish(form.getFieldsValue(), 'publish')}>
            Publish
          </Button>
        </BtnWrapper>
      </Form>
    </Card>
  )
}

const CreateWrapper = styled.div`
  display: flex;
  align-items: baseline;
  .author-input {
    width: 100%;
    margin-right: 7px;
  }
`

const RadioWrapper = styled(Radio.Group)`
  .ant-radio-button-wrapper {
    border-bottom: none;
  }
`

const ToolTipsWrapper = styled(Tooltip)`
  position: absolute;
  right: 3px;
  top: 24px;
`

const BtnWrapper = styled.div`
  display: flex;
  border-top: 1px dashed #ececec;
  padding: 20px 0px 10px;
  Button:last-child {
    margin-left: 5px;
  }
`
