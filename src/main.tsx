import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { App } from './App'
import { Dashboard } from '@/views/dashboard/Index'
import { ArticleList } from '@/views/article/ArticleList'
import { ArticleAnalysis } from '@/views/article/ArticleAnalysis'
import { Profile } from '@/views/profile/Index'
import { Settings } from '@/views/settings/Index'
import { Logout } from '@/views/logout/Index'

import './assets/styles/reset.css'
import 'antd/dist/antd.variable.min.css'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="articles" element={<ArticleList />}></Route>
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
