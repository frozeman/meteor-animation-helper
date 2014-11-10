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
    template._animationElements = this.findAll('.animate');


    // HACK: initial animation rendered, as insertElement, doesn't seem to fire
    _.each(template._animationElements, function(item){
        var $item = $(item);

        // check if the element has a transition
        if(checkForError($item))
            return;

        $item.width(); // force-draw before animation
        $item.removeClass('animate');
    });


    // add the parentNode te the instance, so we can access it in the destroyed function
    template._animation_helper_parentNode = this.firstNode.parentNode;

    template._animation_helper_parentNode._uihooks = {
        insertElement: function (node, next) {
            var $node = $(node);

            $node.insertBefore(next);

            if($node.hasClass('animate') && !checkForError($node)) {

                // add to animation elements array
                if(!_.contains(template._animationElements, node))
                    template._animationElements.push(node);


                // animate
                $node.width(); // force-draw before animation
                Meteor.defer(function(){
                    $node.removeClass('animate');
                });
            }

        },
        removeElement: function (node) {
            var $node = $(node),
                indexOfElement = _.indexOf(template._animationElements, node);

            if(indexOfElement !== -1) { //&& !$node.hasClass('animate')
                
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
                        $(this).off(e);

                        Meteor.clearTimeout(timeoutId);
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
    if(Meteor.isClient && this._animation_helper_parentNode)
        this._animation_helper_parentNode._uihooks = null;
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
