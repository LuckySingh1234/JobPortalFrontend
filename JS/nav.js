$(document).ready(function() {
    const signedInUserJsonString = localStorage.getItem('signedInUser');
    const signedInUser = JSON.parse(signedInUserJsonString);
    const signedInAdmin =  localStorage.getItem('signedInAdmin');

    const myApplicationsBtn = document.getElementById('myApplicationsBtn');
    const profileBtn = document.getElementById('profileBtn');
    const signInBtn = document.getElementById('signinbtn');
    const signUpBtn = document.getElementById('signupbtn');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminProfileBtn = document.getElementById('adminProfileBtn');

    const mobile = document.getElementById('mobile');
    const email = document.getElementById('email');
    const adminEmail = document.getElementById('adminEmail');

    if(signedInUser === null && signedInAdmin === null) {
        signInBtn.style.display = 'block';
        signUpBtn.style.display = 'block';
        adminLoginBtn.style.display = 'block';

        myApplicationsBtn.style.display = 'none';
        profileBtn.style.display = 'none';
        adminProfileBtn.style.display = 'none';
    }

    if(signedInUser !== null || signedInAdmin !== null) {
        signInBtn.style.display = 'none';
        signUpBtn.style.display = 'none';
        adminLoginBtn.style.display = 'none';
    }

    if (signedInUser !== null) {
        myApplicationsBtn.style.display = 'block';
        profileBtn.style.display = 'block';
        adminProfileBtn.style.display = 'none';

        mobile.innerHTML = signedInUser.mobile;
        email.innerHTML = signedInUser.email;
    }

    if (signedInAdmin !== null) {
        myApplicationsBtn.style.display = 'none';
        profileBtn.style.display = 'none';
        adminProfileBtn.style.display = 'block'; 

        adminEmail.innerHTML = signedInAdmin;
    }
});

function signOut() {
    localStorage.removeItem('signedInUser');
    window.location = '/signin.html'
}

function adminSignOut() {
    localStorage.removeItem('signedInAdmin');
    window.location = '/index.html'
}
