import React , {Component} from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import routes from './route'


class App extends Component {
  render () {
    return (
      <Router>
       <Switch>
        { 
          routes.map((r, i)=><Route {...r} key={i} />) 
        }
      </Switch>
      </Router>)
  }
}

export default <App />