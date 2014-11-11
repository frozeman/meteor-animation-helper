/**
Aniamtion-Helper

@module package animation-helper
**/


/**
Check if the animation element has a animation set

@method checkForError
@return {Boolean} true, when an error was detected
*/
var checkForError = function($node){

    if($node.css('transition') === 'all 0s ease 0s' && $node.css('animation') === 'none 0s ease 0s 1 normal none running') {
        console.warn('animation-helper error: The following element has no transition defined, but an "animate" class:', $node[0]);
        return true;
    } else
        return false;
};


Template['Animate'].rendered = function(){
    var template = this;
    // template._animation_helper_animationElements = this.findAll('.animate');


    // HACK: initial animation rendered, as insertElement, doesn't fire as the rendered callback happended after the first insert
    _.each(this.findAll('.animate'), function(item){
        var $item = $(item);

        // check if the element has a transition
        if(checkForError($item))
            return;

        $item.width(); // force-draw before animation
        $item.removeClass('animate');

        console.log('rendered', item, item._animation_helper_isVisible);

        $item.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionEnd msTransitionEnd animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd animationEnd msAnimationEnd', function(e) {
            if (e.target === item) {
                $item.off(e);
                item._animation_helper_isVisible = true;
            }
        });
    });


    // add the parentNode te the instance, so we can access it in the destroyed function
    template._animation_helper_parentNode = this.firstNode.parentNode;

    template._animation_helper_parentNode._uihooks = {
        insertElement: function (node, next) {
            var $node = $(node);

            $node.insertBefore(next);

            console.log('inserted', node, node._animation_helper_isVisible);

            if($node.hasClass('animate') && !checkForError($node)) {



                // add to animation elements array
                // if(!_.contains(template._animation_helper_animationElements, node))
                //     template._animation_helper_animationElements.push(node);


                // animate
                $node.width(); // force-draw before animation
                $node.removeClass('animate');

                $node.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionEnd msTransitionEnd animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd animationEnd msAnimationEnd', function(e) {
                    if (e.target === node) {
                        $node.off(e);
                        node._animation_helper_isVisible = true;
                    }
                });
            }

        },
        removeElement: function (node) {
            var $node = $(node);
                // indexOfElement = _.indexOf(template._animation_helper_animationElements, node);

            console.log('removed',node, node._animation_helper_isVisible);

            if(node._animation_helper_isVisible) { //&& !$node.hasClass('animate') //indexOfElement !== -1 && 
                
                // add timeout in case the element wasn't removed
                var timeoutId;
                if(Meteor.isClient) {
                    timeoutId = Meteor.setTimeout(function(){
                        $node.remove();
                        $node = null;
                    }, 5000);
                }

                // remove from animation elements array
                // delete template._animationElements[indexOfElement];
                $node.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionEnd msTransitionEnd animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd animationEnd msAnimationEnd', function(e) {
                    if (e.target === node) {
                        $node.off(e);

                        Meteor.clearTimeout(timeoutId);

                        delete node._animation_helper_isVisible;
                        $node.remove();
                        $node = null;
                    }

                });
                $node.addClass('animate').width();

            // otherwise remove immedediately
            } else {
                $node.remove();
                $node = null;
            }

        }
    };
};

Template['Animate'].destroyed = function(){
    var template = this;

    if(Meteor.isClient && template._animation_helper_parentNode) {
        Tracker.afterFlush(function(){
            template._animation_helper_parentNode._uihooks = null;
        });
    }
};


/**
The destroyed method, which remove the hooks to make sure, they work again next time.

*/
// Template['Animate'].destroyed = function(){
//     var template = this;
//     // Meteor.defer(function(){
//         template._animation_helper_firstNode.parentNode._uihooks = null;
//     // });

// };
