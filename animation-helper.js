/**
Aniamtion-Helper

@module package animation-helper
**/


Template['Animate'].rendered = function(){
    var animationElements = this.findAll('.animate');

    // HACK: initial animation rendered, as insertElement, doesn't seem to fire
    _.each(animationElements, function(item){
        var $item = $(item);

        $item.width(); // force-draw before animation
        $item.removeClass('animate');

    });


    // add the parentNode te the instance, so we can access it in the destroyed function
    this._animation_helper_parentNode = this.firstNode.parentNode;

    this._animation_helper_parentNode._uihooks = {
        insertElement: function (node, next) {

            var $node = $(node);

            $node.insertBefore(next);

            if($node.hasClass('animate')) {
                // add to animation elements array
                animationElements.push(node);

                // animate
                $node.width(); // force-draw before animation
                Meteor.defer(function(){
                    $node.removeClass('animate');
                });
            }

        },
        removeElement: function (node) {

            var $node = $(node),
                indexOfElement = _.indexOf(animationElements, node);

            if(indexOfElement !== -1) {
                // remove from animation elements array
                delete animationElements[indexOfElement];

                $node.addClass('animate').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
                    $node.remove();
                    $node = null;
                });

            // otherwise remve immedediately
            } else {
                $node.remove();
                $node = null;
            }

        }
    };
};


/**
The destroyed method, which remove the hooks to make sure, they work again next time.

*/
Template['Animate'].destroyed = function(){
    var template = this;
    Meteor.defer(function(){
        template._animation_helper_parentNode._uihooks = null;
    });
};