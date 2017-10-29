import React from 'react';

export default class Clock extends React.Component {
	render(){
		return (
			<span>
				<h1>Time: { Date.now() } Changed again</h1>
				<h2>Yoq</h2>
			</span>
		);


	}
}

