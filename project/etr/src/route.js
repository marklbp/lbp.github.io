import React from 'react'
import Publish from './publish.jsx'
import Hoc from './hoc.jsx'

export default [
  /*{
    exact: true,
    path: '/',
    component: ()=><Project activeIndex="project"/>
  },
  {
    path: '/project',
    component: ()=><Project activeIndex="project"/>
  },
  {
    path: '/resource',
    component: ()=><Resource activeIndex="resource"/>
  },
  {
    path: '/publish',
    component: ()=><Publish activeIndex="publish"/>
  },
  {
    path: '/messages',
    component: ()=><Messages activeIndex="messages"/>
  },
  {
    path: '/me',
    component: ()=><Me activeIndex="me" />
  }*/
  {
    exact: true,
    path: '/',
    render (props) {
      return <Hoc {...props} page="项目" className="page-project" />
    }
  },
  {
    path: '/project',
    render (props) {
      return <Hoc {...props} page="项目" className="page-project" />
    }
  },
  {
    path: '/resource',
    render (props) {
      return <Hoc {...props} page="资源" className="page-resource" />
    }
  },
  {
    path: '/publish',
    render (props) {
      return <Publish {...props} page="发布" className="page-publish" />
    }
  },
  {
    path: '/messages',
    render (props) {
      return <Hoc {...props} page="消息" className="page-messages" />
    }
  },
  {
    path: '/me',
    render (props) {
      return <Hoc {...props} page="我的" className="page-me" />
    }
  }
]