import React, { useState } from 'react'
import styled from 'styled-components'

const Sidebar = () => {
    return (
        <SidebarWrapper>
            <div className="logo-wrapper">
                <img src="src/assets/images/svg-icons/cms-logo.svg" alt="logo" />
            </div>
        </SidebarWrapper>
    )
}

export {
    Sidebar
}

const SidebarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .logo-wrapper {
    margin-top: 5px;
    width: 47px;
    height: 47px;
    img {
        max-width: 100%;
        max-height: 100%;
    }
  }
  .sidebar-list {
    .sidebar-item {
      padding: 20px;
    }
  }
`