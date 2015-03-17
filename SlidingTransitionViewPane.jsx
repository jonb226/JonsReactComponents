/*global define, console*/
define([
	'React',
	'jsx!Toolbar'
], function (React, Toolbar) {
	'use strict';
	
	return React.createClass({
		render: function () {
			var paneStyle = {
				width: '25%',
				height: '100%',
				float: 'left'
			};
			return (/*jshint ignore:start */
				<div ref='node' style={paneStyle}>
					{this.props.children}
				</div>
			/*jshint ignore:end */);
		}
	});
});