import React from 'react'
import Footer from './footer.jsx'

export default (props)=>(
  <div className="page-me">
    <div>我的</div>
    <Footer activeIndex={props.activeIndex} />
  </div>
)