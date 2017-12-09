import React from 'react';
import Clock from './Clock.jsx';

export default class App extends React.Component {

  doSomething(){
    console.log('something');
  }

  render() {
    return (
     <div style={{textAlign: 'center'}}>
        <h1 onClick={this.doSomething.bind(this)}>Hello</h1>
        <Clock />
      </div>);
  }
}