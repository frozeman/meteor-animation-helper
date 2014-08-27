Animates elements inside a {{> Animate}} block, by removing and adding an `animate` class.

Requires at least Meteor version 0.9.0
<!-- Demo: http://templatesession2demo.meteor.com -->

This package uses the new UI_hooks, allowing for animation when elements get add AND removed.


Installation
============

    $ meteor add mrt:animation-helper

Usage
=====


Wrap the templates or template parts with the {{#Animate}}..{{/Animate}} helper and add the animate class to elements you want to animate. Then specify CSS transitions, which should happen when the class gets removed:

	{{#Animate}}
		<div class="myblock animate">
			...
		</div>
	{{/Animate}}

	// CSS

	.myBlock {
		opacity: 1; // value after the animate class got removed
		transition: opacity 200ms;
	}
	.myBlock.animate {
		opacity: 0; // initial value
	}