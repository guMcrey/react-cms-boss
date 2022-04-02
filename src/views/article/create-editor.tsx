// wangeditor
import React, { useEffect, useState } from 'react'
import '@wangeditor/editor/dist/css/style.css'
import { IDomEditor, IEditorConfig, IToolbarConfig, i18nChangeLanguage } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { Button, Card } from 'antd'
import styled from 'styled-components'
import { CreateArticle } from './create'

export const CreateArticleEditor = () => {
  const [editor, setEditor] = useState<IDomEditor | null>(null)

  const defaultHtml = <DefaultHtmlStyle></DefaultHtmlStyle>
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: ['fullScreen'],
  }
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: 'Please enter...',
    MENU_CONF: {
      fontSize: {
        fontSizeList: ['16px', '18px', '22px'],
      },
    },
    onCreated: (editor) => {
      i18nChangeLanguage('en')
      setEditor(editor)
    },
  }

  useEffect(() => {
    return () => {
      if (editor === null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <EditorWrapper>
      <div>
        {/* TODO: change toolbar background-color */}
        <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" style={{ margin: '0 1px' }}></Toolbar>
        <Card bordered={false}>
          <TitleWrapper>
            <input placeholder="Please enter title"></input>
          </TitleWrapper>
          <Editor
            defaultConfig={editorConfig}
            defaultHtml={`${defaultHtml}`}
            mode="default"
            style={{ height: '723px', overflowY: 'hidden' }}
          ></Editor>
        </Card>
      </div>
      <div style={{ width: 430, height: 'auto' }}>
        <CreateArticle></CreateArticle>
      </div>
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
