import React from 'react'
import Footer from './footer.jsx'

export default (props)=>(
  <div className="page-resource">
    <div>资源</div>
    <Footer activeIndex={props.activeIndex} />
  </div>
)