let username = '';
let password = '';
$(function() {
   $("#usernameBox").dxTextBox({
       placeholder: "Enter username",
       width: '250px',
       onValueChanged: function (e) {
           username = e.value;
       }
   });
   $("#passwordBox").dxTextBox({
       placeholder: "Enter password",
       mode: 'password',
       width: '250px',
       onValueChanged: function (e) {
           password = e.value;
       }
   });
   $("#signIn").dxButton({
        stylingMode: "contained",
        text: "Sign In",
        type: "success",
        width: 250,
        onClick: function() {
            $.ajax({
                url: "/signIn",
                type: "get",
                data: {
                    username: username,
                    password: password
                },
                success: function(response) {
                    if (response === 'success') {
                        window.location.href = 'portfolio';
                    }
                    else {
                        DevExpress.ui.notify("Error: Incorrect Username or Password", "warning", 500);
                    }
                },
                error: function(xhr) {
                    DevExpress.ui.notify("Error", "warning", 500);
                }
            });
        }
   });
   $("#createAcct").dxButton({
       stylingMode: "contained",
       text: "Create Account",
       type: "success",
       width: 250,
       onClick: function() {
           window.location.href = 'createAccount';
       }
   });
   $("#viewSample").dxButton({
        stylingMode: "contained",
        text: "View Sample",
        type: "success",
        width: 250
   });
});