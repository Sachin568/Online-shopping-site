$('#signupForm').submit((event) => {
    event.preventDefault();
    $('#errormessage').hide();
    console.log($('#psw-repeat').val(), $('#psw').val())
    // console.log($('#signupForm').serialize())
    if ($('#psw-repeat').val() != $('#psw').val()) {
        $('#errormessage').text("Password doesn't match!")
        $('#errormessage').show();
    } else {
        $.post($('#signupForm').attr('action'), $('#signupForm').serialize())
            .done(function (response) {
                window.location.href = '/mainpage';
                // $.redirect('/mainpage', {});
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                $('#errormessage').text(JSON.parse(jqXHR.responseText).errormessage);
                // alert(jqXHR.responseText)
                $('#errormessage').show();
            });
        // $.ajax({
        //     url: $('#signupForm').attr('action'),
        //     type: 'POST',
        //     data: $('#signupForm').serialize(),

        //     success: function (result) {
        //         window.location.href = '/mainpage'
        //     },
        //     error: function (jqXHR, textStatus, errorThrown) {
        //         $('#errormessage').text(JSON.parse(jqXHR.responseText).errormessage);
        //         // alert(jqXHR.responseText)
        //         $('#errormessage').show();
        //     }
        // });
    }
});
