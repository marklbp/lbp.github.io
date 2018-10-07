import React from 'react'
import Footer from './footer.jsx'

export default (props)=>{
  console.log(props)
  return (<div className={props.className}>
    <div>{props.page}</div>
    <Footer {...props} />
  </div>)
}