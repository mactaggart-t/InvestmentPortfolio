let username = '';
let password = '';
let reEnterPassword = '';
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
   $("#repeatPassword").dxTextBox({
       placeholder: "Re-Enter password",
       mode: 'password',
       width: '250px',
       onValueChanged: function (e) {
           reEnterPassword = e.value;
       }
   });
   $("#createAcct").dxButton({
       stylingMode: "contained",
       text: "Create Account",
       type: "success",
       width: 250,
       onClick: function() {
            $.ajax({
                url: "/createAcct",
                type: "get",
                data: {
                    username: username,
                    password: password,
                    secondPass: reEnterPassword,
                },
                success: function(response) {
                    if (response === 'success') {
                        window.location.href = 'portfolio';
                    }
                    else if (response === 'no match') {
                        DevExpress.ui.notify("Error: Passwords don't match", "warning", 500);
                    }
                    else if (response === 'no empty') {
                        DevExpress.ui.notify("Error: Passwords cannot be empty", "warning", 500);
                    }
                    else if (response === 'username taken') {
                        DevExpress.ui.notify("Sorry: Username taken", "warning", 500);
                    }
                },
                error: function(xhr) {
                    DevExpress.ui.notify("Error", "warning", 500);
                }
            });
        }
   });
});