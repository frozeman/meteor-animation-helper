Package.describe({
    summary: "Animates elements inside a {{> Animate}} block, by removing and adding an `animate` class."
});

Package.on_use(function (api) {

    // third party
    api.use('underscore', 'client');
    api.use('templating', 'client');
    api.use('jquery', 'client');

    api.use('velocityjs', 'client');

    // FILES
    api.add_files('animation-helper.html', 'client');
    api.add_files('animation-helper.js', 'client');

});


Package.on_test(function (api) {

    api.use('animation-helper');
    api.use('tinytest');

});