$(document).ready(function () {
    // alert(userInfo)
    console.log(typeof (username), username)
    if (username === "") {
        $("#account").hide()
        $("#shopping-cart").hide()
        $("#log-out").hide()
        $("#log-in").show()
        $("#sign-up").show()
    } else {
        $("#account").show()
        $("#shopping-cart").show()
        $("#log-out").show()
        $("#log-in").hide()
        $("#sign-up").hide()
    }
})
$("search").click(function () {
    $.ajax({
        url: "/mainpage",
        type: "get",
        data: {
            searchOn: $("#searchbar").val(),
        },
        success: function (response) {
            //Do Something
        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });
})
$('#signupForm').submit((event) => {
    event.preventDefault();
    $('#errormessage').hide();
    console.log($('#psw-repeat').val(), $('#psw').val())
    // console.log($('#signupForm').serialize())
    if ($('#psw-repeat').val() != $('#psw').val()) {
        $('#errormessage').text("Password doesn't match!")
        $('#errormessage').show();
    } else {
        // $.post($('#signupForm').attr('action'), $('#signupForm').serialize())
        //     .done(function (response) {
        //             window.location.replace = response.redirectURL;
        //         // $.redirect('/mainpage', {});
        //     })
        //     .fail(function (jqXHR, textStatus, errorThrown) {
        //         $('#errormessage').text(JSON.parse(jqXHR.responseText).errormessage);
        //         // alert(jqXHR.responseText)
        //         $('#errormessage').show();
        //     });
        $.ajax({
            url: $('#signupForm').attr('action'),
            type: 'POST',
            data: $('#signupForm').serialize(),
            success: function (response) {
                console.log(response.redirectURL)
                window.location.href = response.redirectURL;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#errormessage').text(JSON.parse(jqXHR.responseText).errormessage);
                // alert(jqXHR.responseText)
                $('#errormessage').show();
            }
        });
    }
});
