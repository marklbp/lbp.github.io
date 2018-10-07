import React, {Component} from "react"
import Footer from './footer.jsx'

export default (props)=>{
  console.log(props.match)
  return (
    <div className="page-project">
      <div>项目</div>
      <Footer activeIndex={props.activeIndex} />
    </div>
  )
}