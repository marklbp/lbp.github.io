import React from "react"
import { Link } from "react-router-dom"
import {classnames} from './utils'
import './assets/css/footer.scss'
import navLProject from './assets/img/nav-light-project.png'
import navProject from './assets/img/nav-project.png'
import navLResource from './assets/img/nav-light-resource.png'
import navResource from './assets/img/nav-resource.png'
import navAdd from './assets/img/nav-add.png'
import navLMsg from './assets/img/nav-light-msg.png'
import navMsg from './assets/img/nav-msg.png'
import navLMy from './assets/img/nav-light-my.png'
import navMy from './assets/img/nav-my.png'

let navs = [
  {to: '/project', img: [navProject, navLProject], text: '项目'},
  {to: '/resource', img: [navResource, navLResource], text: '资源'},
  {to: '/publish', img: [navAdd, navAdd], text: ''},
  {to: '/messages', img: [navMsg, navLMsg], text: '消息'},
  {to: '/me', img: [navMy, navLMy], text: '我的'},
]

const Footer = (props) => {
  return (<div className="footer">
    {
      navs.map((n, i) => {
        let classList = classnames({focus: props.match.path === n.to})
        return (<Link to={n.to} key={i} className={classList}>
          <img src={n.img[Number(props.match.path === n.to)]} />
          <span>{n.text}</span>
        </Link>)    
      })
    }
  </div>)
}

export default Footer