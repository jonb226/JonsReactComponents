/*global define, console*/
define([
	'React',
	'jquery',
	'jsx!AnimationMixin'
], function (React, $, AnimationMixin) {
	'use strict';
	
	return React.createClass({
		mixins: [AnimationMixin],
		getInitialState: function () {
			return {
				left: 0,
				viewLayout: [0],
				containerPosition: 0,
				nextContainerPosition: 0,
				stylePropsToAnimate: ['left'],
				animatedElementStyle: {
					height: '100%',
					width: '400%',
					position: 'absolute',
					left: '0%'
				}
			};
		},
		componentWillAnimate: function (nextProps) {
			var currentView = this.getIndexForView(this.props.view),
				nextView = this.getIndexForView(nextProps.view);
			
			if(nextView === -1){
				// If we have a bad property value, show the default
				React.Children.forEach(this.props.children, function (c, i) {
					if(c.props.default){
						nextView = i;
					}
				}); 
			}
			
			if(nextView > currentView){
				this.setState({
					viewLayout: [currentView, nextView],
					containerPosition: 0,
					nextContainerPosition: 1
				});
			}else if(nextView < currentView){
				this.setState({
					viewLayout: [nextView, currentView],
					containerPosition: 1,
					nextContainerPosition: 0
				});
			}else{
				// don't animate
				return true;
			}
		},
		animationInterrupted: function (nextProps, currentStyle) {
			var nextView = this.getIndexForView(nextProps.view),
				curContainerPos = parseFloat(currentStyle.left)/
					parseFloat($(this.refs.sizingContainer.getDOMNode()).css('width'))/
					-1,
				showingViews = [this.state.viewLayout[Math.floor(curContainerPos)], 
								this.state.viewLayout[Math.ceil(curContainerPos)]];
			
			// If we are interrupted before moving at all, only one view is showing
			if(showingViews[0] === showingViews[1]){
				showingViews = [showingViews[0]];
			}
			
			if(showingViews.indexOf(nextView) !== -1){
				// The view we are changing to is already showing
				this.setState({
					viewLayout: showingViews,
					containerPosition: curContainerPos % 1,
					nextContainerPosition: showingViews.indexOf(nextView)
				});
			}else{
				// We are going to a non-showing view so add it to the correct end
				if(nextView < showingViews[0]){
					this.setState({
						viewLayout: [nextView].concat(showingViews),
						containerPosition: (curContainerPos % 1) + 1,
						nextContainerPosition: 0
					});
				}else{
					// This case also handles when a new view that needs to be shown
					// is actually located between the showing views. We will just
					// add it to the right
					var newViewLayout = showingViews.concat([nextView]);
					this.setState({
						viewLayout: newViewLayout,
						containerPosition: (curContainerPos % 1),
						nextContainerPosition: newViewLayout.length - 1
					});
				}
			}
		},
		componentAnimationIsReady: function () {
			this.setState({
				containerPosition: this.state.nextContainerPosition
			});
		},
		animationCompleted: function(){
			var currentView = this.getIndexForView(this.props.view);
			
			this.setState({
				viewLayout: [currentView],
				containerPosition: 0,
				nextContainerPosition: 0
			});
		},
		getIndexForView: function (viewName) {
			var indexes = React.Children.map(this.props.children, function(c){
				return c.props.name === viewName;
			});
			return Object.keys(indexes).map(function(i){return indexes[i]}).indexOf(true);
		},
		render: function () {
			var self = this,
				s = this.state.animatedElementStyle,
				viewsToRender = [];
			s.left = (this.state.containerPosition * -100) + '%';
			
			// convert children from opaque data structure to regular array
			React.Children.forEach(this.props.children, function (child, i) {
				viewsToRender[i] = child;
			});
			
			return (/*jshint ignore:start */
				<div ref='sizingContainer' style={{width:'100%',height:'100%'}}>
					<div ref='animatedElement' style={s}>
							// Need to present the views in the same order as viewLayout
							{this.state.viewLayout.map(function(e){
								return viewsToRender[e];
							})}
					</div>
				</div>
			/*jshint ignore:end */);
		}
	});
});