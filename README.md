Animates elements inside a {{> Animate}} block, by removing and adding an `animate` class.

This package uses the new UI_hooks, allowing for animation when elements get add AND removed.


Installation
============

    $ meteor add frozeman:animation-helper

Usage
=====


Wrap the templates or template parts with the {{#Animate}}..{{/Animate}} helper. Elements with an `animate` class will be animated, by removing this class when Meteor adds them (e.g. when using {{#if}}...{{/if}} statements, or rendering templates).
The `animate` class will then be added back, before Meteor wants to remove those elements and waits until the specified `transition-duration` of the class has finished before removing them:

	{{#Animate}}
		<div class="my-element animate">
			...
		</div>
	{{/Animate}}

	// to animate this element on add/remove add some CSS transitions:

	.my-element {
		opacity: 1; // value after the animate class got removed
		transition: opacity 200ms;
	}
	.my-element.animate {
		opacity: 0; // initial value
	}


**Note**: When you have template helpers in the same class of the element you want to animate, Meteor will reset the all classes when the helper re-runs and therefore put the animate class back!
In this case its better to put the animating element around the element with the helper:

If you have this:

    <div class="my-element animate {{someHelper}}">...</div>

Do something like this:

    <div class="animate">
    	<div class="my-element {{someHelper}}">...</div>
	</div>