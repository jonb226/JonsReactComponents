/*jslint node:true,esnext:true*/
'use strict';

var React = require('react');
var $ = require('jquery');

var TICK = 17,
    TRANSITION_TIME = .3;

module.exports = {
    getInitialState: function () {
        return {
            animating: false,
            setupTimeout: -1
        };
    },
    componentWillReceiveProps: function (nextProps) {
        var willAnimate = true,
            oldStyle,
            currentStyle,
            i,
            setupTimeout;

        if (this.state.animating) {
            if (this.ignoreAnimationInterruptions) {
                return;
            }
            if (this.animationInterrupted) {
                // If we were interrupted before calling setupAnimation, we do not 
                // want to call that twice, so cancel the waiting one
                clearTimeout(this.state.setupTimeout);

                // We do not want to call the completed callback for the interrupted
                // animation, since it did not complete
                this.refs.animatedElement.getDOMNode().
                    removeEventListener(this.transitionEndCallback);

                oldStyle = $.extend({}, this.refs.animatedElement.props.style);
                oldStyle.transition = 'none';
                this.setState({animatedElementStyle: oldStyle});

                // Collect the current style animation, so the interrupted handler
                // can set whatever it needs to appropriately.
                currentStyle = {};
                for (i = 0; i < this.state.stylePropsToAnimate.length; i = i + 1) {
                    // jQuery happens to use getComputedStyle, which gets the actual
                    // style rather than the final style for the transition
                    currentStyle[this.state.stylePropsToAnimate[i]] =
                        $(this.refs.animatedElement.getDOMNode()).
                            css(this.state.stylePropsToAnimate[i]);
//						stateToSet[this.state.stylePropsToAnimate[i]] =
//							getComputedStyle(this.refs.animatedElement.getDOMNode(),
//								null).getPropertyValue(this.state.stylePropsToAnimate[i]);
                }
                this.animationInterrupted(nextProps, currentStyle);
            }
        } else {
            if (this.componentWillAnimate) {
                // Allow the animation to be cancelled
                willAnimate = !this.componentWillAnimate(nextProps);
            }
        }
        if (willAnimate) {
            // Save the timeout so it can be cancelled if need be
            setupTimeout = setTimeout(this.setupAnimation, TICK);
            this.setState({animating: true, setupTimeout: setupTimeout});

            this.refs.animatedElement.getDOMNode().
                addEventListener('transitionend', this.transitionEndCallback);
        }
    },
    transitionEndCallback: function () {
        var oldStyle = $.extend({}, this.refs.animatedElement.props.style);
        oldStyle.transition = 'none';
        this.setState({
            animatedElementStyle: oldStyle,
            animating: false
        });
        if (this.animationCompleted) {
            this.animationCompleted();
        }
        this.refs.animatedElement.getDOMNode().
            removeEventListener('transitionend', this.transitionEndCallback);
    },
    setupAnimation: function () {
        var oldStyle = $.extend({}, this.refs.animatedElement.props.style),
            newTransition = this.state.stylePropsToAnimate.concat('').
                join(' ' + TRANSITION_TIME + 's ease,').slice(0, -1);
        oldStyle.transition = newTransition;
        this.setState({animatedElementStyle: oldStyle});
        this.componentAnimationIsReady();
    }
};