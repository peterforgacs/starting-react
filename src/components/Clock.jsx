import React from 'react';

export default class Clock extends React.Component {
	render(){
		return (
			<span>
				<h1>{ Date.now() }</h1>
				<h2>Hi</h2>
			</span>
		);


	}
}

