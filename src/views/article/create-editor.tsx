// wangeditor
import React, { useEffect, useState } from 'react'
import '@wangeditor/editor/dist/css/style.css'
import { IDomEditor, IEditorConfig, IToolbarConfig, i18nChangeLanguage } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { Card } from 'antd'
import styled from 'styled-components'
import { CreateArticle } from './create'
import { debounce } from '@/utils/function'
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons'
import { ImageElement, VideoElement } from './wangEditor'

export const CreateArticleEditor = () => {
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [isShowVisible, setIsShowVisible] = useState(true)
  const [defaultHtml, setDefaultHtml] = useState(<DefaultHtmlStyle></DefaultHtmlStyle>)
  const [insertedImgList, setInsertedImgList] = useState<string[]>([])
  const [insertedVideoList, setInsertedVideoList] = useState<string[]>([])
  const insertedImgStorage: string[] = []
  const insertedVideoStorage: string[] = []

  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: ['fullScreen'],
  }

  const customCheckLinkFn = (text: string, url: string): undefined | string | boolean => {
    if (!url) {
      return
    }
    if (!url.includes('http')) {
      return 'Links must start with http/https'
    }
    return true
  }

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: 'Please enter...',
    MENU_CONF: {
      fontSize: {
        fontSizeList: ['16px', '18px', '22px'],
      },
      insertLink: {
        checkLink: customCheckLinkFn,
      },
      uploadImage: {
        server: '/api/upload/article-content-img',
      },
      insertImage: {
        onInsertedImage: async (imageNode: ImageElement | null) => {
          if (imageNode === null) return
          const { src } = imageNode
          insertedImgStorage.push(src)
          await setInsertedImgList([...insertedImgStorage])
        },
      },
      uploadVideo: {
        server: '/api/upload/article-content-video',
      },
      insertVideo: {
        // TODO: video deference
        onInsertedVideo: async (videoNode: VideoElement | null) => {
          if (videoNode === null) return
          const { src } = videoNode
          insertedVideoStorage.push(src)
          await setInsertedVideoList([...insertedVideoStorage])
        },
      },
    },
    onCreated: (editor) => {
      i18nChangeLanguage('en')
      setEditor(editor)
    },
    onChange: (editor) => {
      const contentText = editor.getText()
      const contentHtml = editor.getHtml()
      setDescription(contentText)
      setContent(contentHtml)
    },
  }

  const titleChangeHandler = (e: any) => {
    setTitle(e.target.value)
  }

  const getEditInfo = async (data: any) => {
    await setTitle(data.title)
    await setContent(data.content)
    await setDefaultHtml(data.content)
  }

  useEffect(() => {
    setDefaultHtml(content as any)
  }, [])

  useEffect(() => {
    return () => {
      if (editor === null) return
      setEditor(null)
      editor.destroy()
    }
  }, [editor])

  return (
    <EditorWrapper>
      <Card bordered={false} style={{ flex: '1 1 auto', position: 'relative' }}>
        <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" style={{ margin: '0 1px' }}></Toolbar>
        <TitleWrapper>
          <input type="text" placeholder="Please enter title" value={title} onChange={titleChangeHandler}></input>
        </TitleWrapper>
        {defaultHtml && (
          <Editor
            defaultConfig={editorConfig}
            defaultHtml={`${defaultHtml}`}
            mode="default"
            style={{ height: '637px', overflowY: 'hidden' }}
          ></Editor>
        )}
        {!defaultHtml && (
          <Editor
            defaultConfig={editorConfig}
            defaultHtml={`${defaultHtml}`}
            mode="default"
            style={{ height: '637px', overflowY: 'hidden' }}
          ></Editor>
        )}
        <ExpandAndFoldWrapper onClick={() => setIsShowVisible(!isShowVisible)}>
          {isShowVisible && (
            <span className="expandBtn">
              <DoubleRightOutlined style={{ color: '#4047f4' }} />
            </span>
          )}
          {!isShowVisible && (
            <span className="expandBtn">
              <DoubleLeftOutlined style={{ color: '#4047f4' }} />
            </span>
          )}
        </ExpandAndFoldWrapper>
      </Card>
      {isShowVisible && (
        <div style={{ minWidth: 400, overflow: 'hidden', height: 'auto' }}>
          <CreateArticle
            title={title}
            description={description}
            content={content}
            insertedImgList={insertedImgList}
            insertedVideoList={insertedVideoList}
            finallyImgList={editor && editor.getElemsByType('image')}
            finallyVideoList={editor && editor.getElemsByType('video')}
            getEditInfo={getEditInfo}
          ></CreateArticle>
        </div>
      )}
    </EditorWrapper>
  )
}

const EditorWrapper = styled.div`
  display: flex;
`

const TitleWrapper = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #ececec;
  input {
    font-size: 30px;
    border: 0;
    outline: none;
    width: 100%;
    line-height: 1;
    padding-left: 10px;
  }
  input::-webkit-input-placeholder {
    color: #7c848d;
  }
`

const DefaultHtmlStyle = styled.p`
  font-size: 14px;
`

const ExpandAndFoldWrapper = styled.div`
  .expandBtn {
    text-align: center;
    width: 35px;
    height: 35px;
    line-height: 35px;
    border-radius: 100%;
    position: absolute;
    top: 40px;
    right: -18px;
    background-color: #fff;
    box-shadow: 0 1px 10px 0 rgb(64 71 244 / 30%);
    z-index: 3;
  }
`
