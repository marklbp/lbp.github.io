import React from 'react'
import Footer from './footer.jsx'

export default (props)=>(
  <div className="page-messages">
    <div>消息</div>
    <Footer activeIndex={props.activeIndex} />
  </div>
)