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
//add item into cart
$("button").click(function () {
    if (this.id.match(/add-to-cart-\d/)) {
        const productIdToAdd = $(`#${this.id}`).parent().attr("id")
        console.log("adding", productIdToAdd, "to cart")
        $.ajax({
            url: "/products/addCart",
            type: "post",
            data: {
                ProductToCart: productIdToAdd
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
    }

})
// a stupid way to remove items in cart ahhhhhhhhhhh
$("button").click(function () {
    if (this.id.match(/remove-item-\d/)) {
        console.log(this.id)
        const itemIdToRemove = $(`#${this.id}`).parent().attr("id")
        console.log("removing", itemIdToRemove, "from cart")
        console.log(itemIdToRemove)
        $.ajax({
            url: "/products/removeItemFromCart",
            type: "post",
            data: {
                ProductToRemove: itemIdToRemove
            },
            success: function (response) {
                console.log(response)
                location.reload(true);
                // alert("product has been removed.")
            },
            error: function (xhr) {
                alert(JSON.parse(xhr.responseText).errormessage)
            },
            // done: function (response,textStatus) {
            //     console.log(response, textStatus)
            // }
        });
    }
})
$("#check-out").submit(function (event) {
    if(cartList.length==0){
        alert("Your cart is empty.")
        event.preventDefault(event);
        return
    }
    $.ajax({
        url: "/users/checkout",
        type: "get",
        data: {
        },
        success: function (response) {
            console.log(response)
            // window.location.href = response.redirectURL
        },
        error: function (xhr) {
            alert(JSON.parse(xhr.responseText).errormessage)
        },
    });
})
$("#place-order").click(function (event) {
    console.log(address)
    for (let attr in address){
        if (address[attr]==""){
            console.log(address[attr])
            alert("please go to the account page to complete your shipping address.")
            return
        }
    }
    return
    $.ajax({
        url: "/users/checkout",
        type: "get",
        data: {
        },
        success: function (response) {
            console.log(response)
            // window.location.href = response.redirectURL
        },
        error: function (xhr) {
            alert(JSON.parse(xhr.responseText).errormessage)
        },
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