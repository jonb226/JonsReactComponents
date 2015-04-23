/*jslint node:true,esnext:true*/
'use strict';

var React = require('react');

module.exports = React.createClass({
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