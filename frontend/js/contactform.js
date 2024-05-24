var msg_to_sent = "";

function emailValidation(form_id, email) {
    jQuery(form_id + ' .has-error').hide();
    var emailExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,10}(?:\.[a-z]{2})?)$/i;
    var email_value = email.val();
    if (email_value.match(emailExp)) {
        msg_to_sent += "Email :" + email_value + "\n";
        return true;
    } else {
        email.after('<div class="alert alert-danger has-error">Please Enter Valid Email address</div>');
        return false;
    }
}

function noValidation(form_id, form_value) {
	var f_value = form_value.val();
	var f_parent = form_value.parent().parent().children('label').text();
	 msg_to_sent +=  f_parent + " : " + f_value + "\n";
     return true;
}

function validate(form_id) {
    var notempty = /.+/;
    var result = true;
    jQuery(form_id + " .req_field").html('');
    jQuery(form_id + " input[type=text]").each(function () {
        var valid_input = true;
        var req = jQuery(this).hasClass('required');
        var input_value = jQuery(this).val();
        var inputt = jQuery(this).data('vali');
        if (req) {
            if (input_value.match(notempty)) {
                if (inputt !== 'undefined' || inputt !== "") {
                    if (inputt === 'email') {
                        valid_input = (valid_input && emailValidation(form_id, jQuery(this)));
                    }
					else if (inputt === 'novalidation') {
                        valid_input = (valid_input && noValidation(form_id, jQuery(this)));
                    }
                }
                result = valid_input;
                return valid_input;
            }
            else {
                jQuery(form_id + " .req_field").html('<div class="alert alert-danger">Please enter the required field </div>');
                result = false;
                return false;
            }
        }
    });
    return result;
}

function logout(){
    const token =localStorage.getItem('token');
    if (token) {
        fetch(`${API_URL}/logout/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                console.log('Logout successful');
                localStorage.removeItem('token');
                window.location.href = '/login.html';
            } else {
                // Hata durumu
                console.log('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.log('No token found');
    }
}
jQuery(document).ready(function () {

    $("#loginForm").on("submit", function(e){
        e.preventDefault();
        const username = $('#login-username').val();
        const password = $('#login-password').val();
    
        fetch(`${API_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed!');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            window.location.href = "index.html";
        })
        .catch(error => {
            alert(error.message);
        });
    });
    $("#registerForm").on("submit", function(e){
        e.preventDefault();
        const username = $('#register-username').val();
        const email = $('#register-mail').val();
        const password1 = $('#register-password').val();
    
        fetch(`${API_URL}/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password1
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Registration failed!');
            }
            return response.json();
        })
        .then(data => {
            alert('Registration successful!');
        })
        .catch(error => {
            alert(error.message);
        });
    });
});
