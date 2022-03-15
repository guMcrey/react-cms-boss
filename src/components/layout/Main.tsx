import React from 'react'
import styled from 'styled-components'

const Main = () => {
    return (
        <MainWrapper>
           <div className="wrapper-title">Hello Hakuna,</div>
           <div>This is what we've got for you today.</div>
        </MainWrapper>
    )
}

export {
    Main
}

const MainWrapper = styled.div`
  .wrapper-title {
      font-size: 22px;
      font-weight: bold;
  }
`