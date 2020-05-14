$(document).ready(function (response) {
    console.log(document.cookie.split(';'))
    checkStatus($.cookie("userInfo"))
    if (selectedCategory) {
        console.log(selectedCategory)
        $("#category").val(selectedCategory)
    }
    if (selectedSearchOn) {
        console.log(selectedSearchOn)
        $("#searchbar").val(selectedSearchOn)
    }
})
$('#address-update').keydown(function (e) {
    if (e.keyCode == 32) {
        return false;
    }
});
//search function is with the plain form, not ajax for it
//add item into cart
$("button").click(function () {
    if (this.id.match(/add-to-cart-\d/)) {
        const productIdToAdd = $(`#${this.id}`).parent().attr("id")
        console.log(typeof ($("#quantity").val()) == "undefined")
        const quantity = (typeof ($("#quantity").val()) != "undefined") ? $("#quantity").val() : 1
        console.log("adding", productIdToAdd, "to cart")
        $.ajax({
            url: "/products/addCart",
            type: "post",
            data: {
                ProductToCart: productIdToAdd,
                quantity: quantity
            },
            success: function (response) {
                console.log(response)
                alert(`product of quantity ${quantity} has been added to cart.`)
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
//add item to wishlist
$("button").click(function () {
    if (this.id.match(/add-to-wish-list-\d/)) {
        const productIdToAdd = $(`#${this.id}`).parent().attr("id")
        console.log("adding", productIdToAdd, "to wishlist")
        $.ajax({
            url: "/products/addwishlist",
            type: "post",
            data: {
                ProductTowishList: productIdToAdd
            },
            success: function (response) {
                console.log(response)
                alert("product has been added to wishlist.")
                // alert("product has been removed.")
            },
            error: function (xhr) {
                alert(JSON.parse(xhr.responseText).errormessage)
            }
        });
    }
})
// move item from wishlist to cart * add and remove
$("button").click(function () {
    if (this.id.match(/move-to-cart-\d/)) {
        const productIdToAdd = $(`#${this.id}`).parent().attr("id")
        console.log("adding", productIdToAdd, "to wishlist")
        $.ajax({
            url: "/products/movetowishlist",
            type: "post",
            data: {
                ProductMoveToCart: productIdToAdd
            },
            success: function (response) {
                console.log(response)
                alert("product has been added to wishlist.")
                location.reload(true);
                // alert("product has been removed.")
            },
            error: function (xhr) {
                alert(JSON.parse(xhr.responseText).errormessage)
            }
        });
    }
}

)

// a stupid way to remove items in cart ahhhhhhhhhhh
$("button").click(function () {
    if (this.id.match(/remove-item-cart-\d/)) {
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
//remove item from wishlist
$("button").click(function () {
    if (this.id.match(/remove-item-wishlist-\d/)) {
        console.log(this.id)
        const itemIdToRemove = $(`#${this.id}`).parent().attr("id")
        console.log("removing", itemIdToRemove, "from wishlist")
        console.log(itemIdToRemove)
        $.ajax({
            url: "/products/removeItemFromWishlist",
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

$("#clear-cart").click(function () {
    if (cartList.length != 0) {
        $.ajax({
            url: "/users/clearcart",
            type: "get",
            data: {
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
    } else {
        alert("your cart is empty already.")
    }

})
$("#clear-wishlist").click(function () {
    if (wishList.length != 0) {
        $.ajax({
            url: "/users/clearwishlist",
            type: "get",
            data: {
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
    } else {
        alert("your wishlist is empty already.")
    }

})

$("#comment").on("submit", function (event) {
    // event.preventDefault();
    if (typeof ($.cookie("userInfo")) == "undefined") {
        alert("You must login before adding comments")
        return
    }
    if ($("#commentRating").val() < 0 | $("#commentRating").val() > 5) {
        alert("rating must be within 0 to 5.")
        return
    }
    if (!/\S/.test($("#commentContent").val())) {
        alert("Comment cannot be empty.")
        return
    }
    const productIdToAdd = $(`#${this.id}`).parent().attr("id")
    console.log($.cookie("userInfo"), productIdToAdd, $("#commentContent").val(), $("#commentRating").val())
    // return false
    $.ajax({
        url: "/comments",
        type: "post",
        data: {
            username: "",
            commentProduct: productIdToAdd,
            content: $("#commentContent").val(),
            rating: $("#commentRating").val()
        },
        success: function (response) {
            console.log(response)
            alert("your comment has been added.")
            location.reload()
        },
        error: function (xhr) {
            alert(JSON.parse(xhr.responseText).errormessage)
        },
        // done: function (response,textStatus) {
        //     console.log(response, textStatus)
        // }
    });

})
$("#check-out").submit(function (event) {
    if (cartList.length == 0) {
        alert("Your cart is empty.")
        event.preventDefault(event);
        return
    }
})
$("#place-order").submit(function (event) {
    console.log(address)
    for (let attr in address) {
        if (address[attr] == "") {
            console.log(address[attr])
            alert("please go to the account page to complete your shipping address.")
            event.preventDefault()
            return
        }
    }
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
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($("#email").val())) {
        alert("please input a valid email address.")
        return
    }

    if ($('#psw-repeat').val() != $('#psw').val()) {
        alert("Password doesn't match!")
        return
    } else {
        $.ajax({
            url: $('#signupForm').attr('action'),
            type: 'POST',
            data: $('#signupForm').serialize(),
            success: function (response) {
                alert("welcome, please sign in.")
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
    if (!/\S/.test($("#street").val()) |
        !/\S/.test($("#city").val()) |
        !/\S/.test($("#state").val()) |
        !/\S/.test($("#zipCode").val())) {
        alert("Your address connot be blank")
        return
    }
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
$("#forget-psw").click(function (event) {
    event.preventDefault()
    alert("We cannot help you. Good luck then.")
    return
})
$("#navigation li").click(function (event) {
    // event.preventDefault();
    const pageParam = $(this).find("a").attr("href")
    console.log(pageParam)
    const newAction = $("#search").attr("action") + pageParam + "&searchOn=" + $("#searchbar").val() + "&category=" + $("#category").val()
    console.log(newAction)
    $(this).find("a").attr("href", newAction)
    console.log($(this).find("a").attr("href"))
})


function checkStatus(userInfo) {
    console.log(userInfo)
    if (!userInfo) {
        $("#account").hide()
        $("#shopping-cart").hide()
        $("#wish-list").hide()
        $("#log-out").hide()
        $("#log-in").show()
        $("#sign-up").show()
        $("#order-history").hide()
        $("#greeting-message").append(`guest`)
    } else {
        $("#account").show()
        $("#shopping-cart").show()
        $("#wish-list").show()
        $("#log-out").show()
        $("#log-in").hide()
        $("#sign-up").hide()
        $("#order-history").show()
        $("#greeting-message").append(`${userInfo}`)
    }
}