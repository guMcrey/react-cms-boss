import React, { useState } from 'react'
import { useGetArticles } from '@/apis/article'
import styled from 'styled-components'
import { Button } from 'antd'

export const Dashboard = () => {
  const { articleList: postArticleList } = useGetArticles({ publish_status: 'publish' })
  const { articleList: draftArticleList } = useGetArticles({ publish_status: 'draft' })

  const visitWebsiteHandler = () => {
    window.open('https://www.google.com', '_blank')
  }

  return (
    <LayoutWrapper>
      <div className="wrapper-title">Hello Hakuna,</div>
      <div className="wrapper-subtile">This is what we've got for you today.</div>
      <ul className="header-list">
        <li className="list-item first">
          <div className="list-item-title">Total post articles</div>
          <div className="list-item-number">{postArticleList?.length || '-'}</div>
        </li>
        <li className="list-item second">
          <div className="list-item-title">Total be post articles</div>
          <div className="list-item-number">{draftArticleList?.length || '-'}</div>
        </li>
        <li className="list-item third">
          <div className="list-item-title">Total post views</div>
          <div className="list-item-number">-</div>
        </li>
        <li className="list-item fourth">
          <div className="list-item-title">Visit the website</div>
          <Button className="visit-btn" type="primary" shape="round" onClick={visitWebsiteHandler}>
            Go
          </Button>
        </li>
      </ul>
    </LayoutWrapper>
  )
}

const LayoutWrapper = styled.div`
  margin: 20px 30px;
  .wrapper-title {
    font-size: 24px;
    font-weight: bold;
    color: 131313;
  }
  .wrapper-subtitle {
    font-size: 14px;
    color: #6b6b6b;
  }
  .header-list {
    margin-top: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
  }
  .list-item {
    position: relative;
    min-width: 23%;
    padding: 24px;
    border-radius: 12px;
    background-color: #fff;
  }
  .first::before {
    position: absolute;
    background: url('src/assets/images/dashboard-image-first.png') top right no-repeat;
    content: '';
    right: 0;
    bottom: 0;
    width: 50%;
    height: 70%;
    background-position: 100%;
    background-size: 70%;
  }
  .second::before {
    position: absolute;
    background: url('src/assets/images/dashboard-image-second.png') top right no-repeat;
    content: '';
    right: 0;
    bottom: 0;
    width: 50%;
    height: 70%;
    background-position: 100%;
    background-size: 70%;
  }
  .third::before {
    position: absolute;
    background: url('src/assets/images/dashboard-image-third.png') top right no-repeat;
    content: '';
    right: 0;
    bottom: 0;
    width: 50%;
    height: 70%;
    background-position: 100%;
    background-size: 70%;
  }
  .fourth::before {
    position: absolute;
    background: url('src/assets/images/dashboard-image-fourth.png') top right no-repeat;
    content: '';
    right: 0;
    bottom: 0;
    width: 50%;
    height: 70%;
    background-position: 100%;
    background-size: 70%;
  }
  .list-item-title {
    font-size: 15px;
    color: #313131;
    font-weight: 500;
  }
  .list-item-number {
    margin-top: 16px;
    font-size: 24px;
    font-weight: 500;
  }
  .visit-btn {
    margin-top: 20px;
  }
`
