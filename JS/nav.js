$(document).ready(function() {
    const signedInUserJsonString = localStorage.getItem('signedInUser');
    const signedInUser = JSON.parse(signedInUserJsonString);

    const signedInManager =  localStorage.getItem('signedInManager');

    const myCartBtn = document.getElementById('mycartbtn');
    const signInBtn = document.getElementById('signinbtn');
    const profileBtn = document.getElementById('profileBtn');
    const signUpBtn = document.getElementById('signupbtn');
    // const managerLoginBtn = document.getElementById('managerLoginBtn');
    const adminProfileBtn = document.getElementById('adminProfileBtn');

    const name = document.getElementById('name');
    const mobile = document.getElementById('mobile');
    const email = document.getElementById('email');
    const adminEmail = document.getElementById('adminEmail');

    if (signedInUser !== null) {
        myCartBtn.style.display = 'block';
        signInBtn.style.display = 'none';
        signUpBtn.style.display = 'none';
        profileBtn.style.display = 'block';
        // managerLoginBtn.style.display = 'none';
        adminProfileBtn.style.display = 'none';

        name.innerHTML = signedInUser.fullName;
        mobile.innerHTML = signedInUser.mobile;
        email.innerHTML = signedInUser.email;
    } else {
        myCartBtn.style.display = 'none';
        signInBtn.style.display = 'block';
        signUpBtn.style.display = 'block';
        profileBtn.style.display = 'none';
    }

    if (signedInManager !== null) {
        myCartBtn.style.display = 'none';
        signInBtn.style.display = 'none';
        signUpBtn.style.display = 'none';
        // managerLoginBtn.style.display = 'none';
        adminProfileBtn.style.display = 'block'; 
        adminEmail.innerHTML = signedInManager;
    } else {
        // managerLoginBtn.style.display = 'block';
        adminProfileBtn.style.display = 'none';
    }
});

function signOut() {
    localStorage.removeItem('signedInUser');
    window.location = '/signin.html'
}

function adminSignOut() {
    localStorage.removeItem('signedInManager');
    window.location = '/index.html'
}
