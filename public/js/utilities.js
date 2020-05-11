$(document).ready(function (response) {
    // console.log(document.cookie.split(';'))
    checkStatus($.cookie("userInfo"))
})
// $("#search").submit(function (event) {
    // event.preventDefault()
    // console.log($("#searchbar").val())
    // return
    // $.ajax({
    //     url: "/mainpage",
    //     type: "get",
    //     data: {
    //         searchOn: $("#searchbar").val()
    //     },
    //     success: function (response) {
    //         //Do Something
    //     },
    //     error: function (xhr) {
    //         //Do Something to handle error
    //     }
    // });
// })
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
    if (cartList.length == 0) {
        alert("Your cart is empty.")
        event.preventDefault(event);
        return
    }
    $.ajax({
        url: "",///users/checkout
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
$("#place-order").submit(function (event) {
    console.log(address)
    for (let attr in address) {
        if (address[attr] == "") {
            console.log(address[attr])
            alert("please go to the account page to complete your shipping address.")
            return
        }
    }
    $.ajax({
        url: "",///users/orderplaced
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

$('#login-form').submit((event) => {
    event.preventDefault();
    console.log($('#psw').val())
    // console.log($('#signupForm').serialize())
    $.ajax({
        url: $('#login-form').attr('action'),
        type: 'POST',
        data: $('#login-form').serialize(),
        success: function (response) {
            console.log(response.redirectURL)
            window.location.href = response.redirectURL;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(JSON.parse(jqXHR.responseText).errormessage)
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
        $.ajax({
            url: $('#signupForm').attr('action'),
            type: 'POST',
            data: $('#signupForm').serialize(),
            success: function (response) {
                window.location.href = response.redirectURL;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(JSON.parse(jqXHR.responseText).errormessage)
            }
        });
    }
});

$("#psw-change").submit((event) => {
    event.preventDefault();
    console.log($('#psw-change').attr('action'))
    console.log($('#new-psw-repeat').val(), $('#new-psw').val())
    // console.log($('#signupForm').serialize())
    if ($('#new-psw-repeat').val() != $('#new-psw').val()) {
        alert("repeat paasword doesn't match");
    } else {
        $.ajax({
            url: $('#psw-change').attr('action'),
            type: 'POST',
            data: $('#psw-change').serialize(),
            success: function (response) {
                console.log(response.redirectURL)
                alert(response.message)
                window.location.href = response.redirectURL;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(JSON.parse(jqXHR.responseText).errormessage)
            }
        });
    }
})

$("#account-update-form").submit((event) => {
    event.preventDefault();
    console.log($('#account-update-form').serialize())
    $.ajax({
        url: $('#account-update-form').attr('action'),
        type: 'POST',
        data: $('#account-update-form').serialize(),
        success: function (response) {
            // console.log(response.redirectURL)
            alert(response.message)
            window.location.href = response.redirectURL;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(JSON.parse(jqXHR.responseText).errormessage)
        }
    });
})


function checkStatus(userInfo) {
    console.log(userInfo)
    if (!userInfo) {
        $("#account").hide()
        $("#shopping-cart").hide()
        $("#log-out").hide()
        $("#log-in").show()
        $("#sign-up").show()
        $("#order-history").hide()
        $("#greeting-message").append(`guest`)
    } else {
        $("#account").show()
        $("#shopping-cart").show()
        $("#log-out").show()
        $("#log-in").hide()
        $("#sign-up").hide()
        $("#order-history").show()
        $("#greeting-message").append(`${userInfo}`)
    }
}