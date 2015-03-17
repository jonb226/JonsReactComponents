/*global define, console*/
define([
	'React',
	'DropboxClient'
], function (React, DropboxClient) {
	'use strict';
	
	return React.createClass({
		signIn: function () {
			console.log('signing in');
			console.log(DropboxClient);
			DropboxClient.authenticate();
		},
		render: function () {
			var style = {
				width: '100%',
				height: '100%',
				textAlign: 'center'
			};
			return (/*jshint ignore:start */
				<div style={style}>
					<p>This app relies on Dropbox for storing your data.</p>
					<p>Please sign into Dropbox using the below button.</p>
					<button onClick={this.signIn}>Sign into Dropbox</button>
				</div>
			/*jshint ignore:end */);
		}
	});
});