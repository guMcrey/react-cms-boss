import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { App } from './App'
import { Dashboard } from '@/views/dashboard/index'
import { ArticleList } from '@/views/article/index'
import { CreateArticle } from '@/views/article/create'
import { ArticleAnalysis } from '@/views/article/article-analysis'
import { Profile } from '@/views/profile/index'
import { Settings } from '@/views/settings/index'
import { Logout } from '@/views/logout/index'

import './assets/styles/reset.css'
import 'antd/dist/antd.variable.min.css'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="articles" element={<ArticleList />}></Route>
          <Route path="article-create" element={<CreateArticle />}></Route>
          <Route path="article-analysis" element={<ArticleAnalysis />}></Route>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="settings" element={<Settings />}></Route>
          <Route path="logout" element={<Logout />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
