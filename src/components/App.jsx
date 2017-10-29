import React from 'react';
import Clock from './Clock.jsx';

export default class App extends React.Component {
  render() {
    return (
     <div style={{textAlign: 'center'}}>
        <h1>Hello World</h1>
        <Clock />
      </div>);
  }
}