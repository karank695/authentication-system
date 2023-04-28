//after clicking on new account creation
$(document).ready(function () {
    $('#new-account-btn').click(function (e) {
        e.preventDefault();
        setTimeout(function () {
            $('.signUp-wrapper').css({
                "z-index": 1,
                "opacity": 1,
                "transition": 'all 0.5s'
            })
            $('.wrapper').css('opacity', 0.3);
        }, 500)

    });
    //clicking on cancel button
    $('#cancel').click(function () {
        $('.signUp-wrapper').css({
            "z-index": -1,
            "opacity": 0
        });
        $('.wrapper').css('opacity', 1);
    })
    //checking for filled value
    let setInt = setInterval(function () {
        //checking the input box is empty or not
        let x = $('.signUp-wrapper input');
        for (let i = 0; i < x.length; i++) {
            x.eq(i).blur(() => {
                check(x.eq(i));
            })
        }
    }, 3000);

    function check(x) {
        if (x.val() == '') {
            x.css('border', 'solid 1px red');
            b = true;
            return;
        } else {
            x.css('border', '');
        }
    }
});
//after submission of signup form
$('.new-account-form form').submit(function (e) {
    e.preventDefault();
    let x = $('.signUp-wrapper input');
    let b = false;
    for (let i = 0; i < x.length; i++) {
        if (x.eq(i).val() == '') {
            b = true;
        }
    }
    if (b == false) {
        //checking for field validation
        let value1 = $('.new-account-form .email').val();
        let value2 = $('.new-account-form .phone').val();
        let numberPattern = /^(\d{10})/;
        let emailPattern = /\w{1,}@\w{1,}\.\w{1,}/;
        let password = $('.new-account-form #pass').val();
        let confirmPass = $('.new-account-form #confirmPass').val();
        if (value1.search(emailPattern) < 0) {
            $('.new-account-form .email').css('border', 'solid 1px red');
            return;
        } else if (value2.search(numberPattern) < 0) {
            $('.new-account-form .phone').css('border', 'solid 1px red');
            return;
        } else if (password != confirmPass) {
            alert(`password not matching`);
            return;
        } else {
            //making ajax call for sending data
            $.ajax({
                type: "POST",
                url: "/createUser",
                data: $('.signUp-wrapper form').serialize(),
                success: function (data) {
                    console.log(data.message);
                    if (data.message=='existed') {
                        window.location.href = 'accountExisted';
                    } else {
                        $('.signUp-wrapper').css({
                            "z-index": -1,
                            "opacity": 0
                        });
                        $('.wrapper').css('opacity', 1);
                       window.location.href = 'signup';  
                    }
                   

                }
            })
        }

    } else {
        let x = $('.signUp-wrapper input');
        for (let i = 0; i < x.length; i++) {
            if (x.eq(i).val() == '') {
                x.eq(i).css('border', 'solid 1px red');
            }
        }
        return;
    }

})