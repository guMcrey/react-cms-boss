import React from 'react'
import styled from 'styled-components'
import { Menu, Dropdown } from 'antd'
import { UserOutlined, DownOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

const menu = (
    <div>
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                <a href="#">
                  Profile
                </a>
            </Menu.Item>
            <Menu.Item  key="settings" icon={<SettingOutlined />}>
                <a href="#">
                  Settings
                </a>
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />}>
                <a href="#">
                  Logout
                </a>
            </Menu.Item>
        </Menu>
    </div>
    
  );
  

const Nav = () => {
    return (
        <NavWrapper>
          <Dropdown overlay={menu} placement="bottom" arrow>
            <div>
                <div className="user-info">
                    <div className="user-avatar"></div>
                    <div className="user-name">Hakuna <DownOutlined /></div>
                </div>
                
            </div>
          </Dropdown>
        </NavWrapper>
    )
}

export {
    Nav
}

const NavWrapper = styled.div`
  .user-info {
    display: flex;
    align-items: center;
  }
  .user-avatar {
      width: 42px;
      height: 42px;
      border-radius: 100%;
      background-color: #f1f1f1;
  }
  .user-name {
      font-size: 14px;
      font-weight: 500;
      margin-left: 10px;
  }
`