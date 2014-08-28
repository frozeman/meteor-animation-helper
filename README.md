Animates elements inside a {{> Animate}} block, by removing and adding an `animate` class.

Requires at least Meteor version 0.9.0
<!-- Demo: http://templatesession2demo.meteor.com -->

This package uses the new UI_hooks, allowing for animation when elements get add AND removed.


Installation
============

    $ meteor add mrt:animation-helper

Usage
=====


Wrap the templates or template parts with the {{#Animate}}..{{/Animate}} helper. Elements with an `animate` class will be animated, by removing this class when Meteor adds them (e.g. when using {{#if}}...{{/if}} statements, or rendering templates).
The `animate` class will then be added back, before Meteor wants to remove those elements and waits until the specified `transition-duration` of the class has finished before removing them:

	{{#Animate}}
		<div class="myblock animate">
			...
		</div>
	{{/Animate}}

	// to animate this element on add/remove add some CSS transitions:

	.myBlock {
		opacity: 1; // value after the animate class got removed
		transition: opacity 200ms;
	}
	.myBlock.animate {
		opacity: 0; // initial value
	}