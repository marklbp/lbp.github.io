import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import './assets/css/footer'
import navLProject from './assets/img/nav-light-project.png'
import navLResource from './assets/img/nav-light-resource.png'
import navAdd from './assets/img/nav-add.png'
import navLMsg from './assets/img/nav-light-msg.png'
import navLMy from './assets/img/nav-light-my.png'

const Footer = () => (
  <Router>
    <div className="footer">
      <Link to="/project">
        <img src={navLProject} />
        <span>项目</span>
      </Link>
      <Link to="/resource">
        <img src={navLResource} />
        <span>资源</span>
      </Link>
      <Link to="/public">
        <img src={navAdd} />
      </Link>
      <Link to="/messages">
        <img src={navLMsg} />
        <span>消息</span>
      </Link>
      <Link to="/my">
        <img src={navLMy} />
        <span>我的</span>
      </Link>
    </div>
  </Router>
)

export default Footer()