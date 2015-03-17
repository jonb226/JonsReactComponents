/*global define, console*/
define(['React', 'merge'], function (React, m) {
	'use strict';
	
	return React.createClass({
		goBack: function () {
			if (this.props.onBack) {
				this.props.onBack();
			}
		},
		goForward: function () {
			if (this.props.onForward) {
				this.props.onForward();
			}
		},
		render: function () {
			/*
			Orange:
			#FFB74D
			#EF6C00
			#E65100
			
			Blue:
			#B3E5FC
			*/
			var buttonStyle = {
					fontSize: '.6em',
					width:'20%',
					display:'inline-block'
				},
				backStyle = m(buttonStyle, {
					textAlign: 'left'
				}),
				forwardStyle = m(buttonStyle, {
					textAlign: 'right'
				}),
				titleStyle = {
					width: '60%',
					textAlign: 'center',
					display:'inline-block'
				},
				barStyle = {
					width: '100%',
					height: '2em',
					fontFamily: 'Century Gothic',
					backgroundColor: '#FFB74D',
					color: '#ffffff',
					padding: '.2em',
					boxSizing: 'border-box',
					fontSize: '1.6em',
					verticalAlign: 'middle',
					boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.3)'
				};
			
			return (/*jshint ignore:start */
			
				<div style={barStyle} onClick={this.props.onClick}>
					<div ref='backButton' onClick={this.goBack} 
						style={backStyle}>Back</div>
					<div ref='title' style={titleStyle}>{this.props.title}</div>
					<div ref='forwardButton' onClick={this.goForward}
						style={forwardStyle}>Forward</div>
				</div>
			/*jshint ignore:end */);
		}
	});
});