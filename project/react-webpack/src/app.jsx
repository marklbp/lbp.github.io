import React , {Component} from 'react'

class HelloWord extends Component {
  render () {
    return (
      <div>
        Hello, {this.props.name}!
      </div>
    )
  }
}

export default <HelloWord name="Marklbp"/>