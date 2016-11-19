var adminPage = function (data) {


    $('.wrapper').load('/admin.html', function () {    //container wich content we r going to change in main page
        $('.cell').text("thia is a text that u added from js");           // that's how we changing content of elements on loading inner pages
    });
};