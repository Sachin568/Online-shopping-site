$(document).ready(function (response) {
    // console.log(document.cookie.split(';'))
    checkStatus($.cookie("userInfo"))
})
$("#search").click(function () {
    $.ajax({
        url: "/mainpage",
        type: "get",
        data: {
            searchOn: $("#searchbar").val()
        },
        success: function (response) {
            //Do Something
        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });
})
$("#add-to-cart").click(function () {
    console.log(productId)
    $.ajax({
        url: "/products/addCart",
        type: "post",
        data: {
            ProductToCart: productId
        },
        success: function (response) {
            console.log(response)
            alert("product has been added to cart.")
        },
        error: function (xhr) {
            alert(JSON.parse(xhr.responseText).errormessage)
        },
        // done: function (response,textStatus) {
        //     console.log(response, textStatus)
        // }
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
        $.ajax({
            url: $('#signupForm').attr('action'),
            type: 'POST',
            data: $('#signupForm').serialize(),
            success: function (response) {
                // console.log(response.redirectURL)
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
function checkStatus(userInfo) {
    console.log(userInfo)
    if (!userInfo) {
        $("#account").hide()
        $("#shopping-cart").hide()
        $("#log-out").hide()
        $("#log-in").show()
        $("#sign-up").show()
        $("#greeting-message").append(`guest`)
    } else {
        $("#account").show()
        $("#shopping-cart").show()
        $("#log-out").show()
        $("#log-in").hide()
        $("#sign-up").hide()
        $("#greeting-message").append(`${userInfo}`)
    }
}