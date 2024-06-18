$(document).ready(function() {
    document.getElementById('name').addEventListener('input', function() {
        document.getElementById('display-name').innerText = this.value || 'Applicant Name';
    });

    document.getElementById('dob').addEventListener('input', function() {
        document.getElementById('display-dob').innerText = `Date of Birth: ${this.value}`;
    });
    
    document.getElementById('email2').addEventListener('input', function() {
        document.getElementById('display-email').innerText = `Email: ${this.value}`;
    });
    
    document.getElementById('institutionName').addEventListener('input', function() {
        document.getElementById('display-institution').innerText = this.value || 'Institution Name';
    });
    
    document.getElementById('degree').addEventListener('input', function() {
        document.getElementById('display-degree').innerText = `Degree: ${this.value}`;
    });
    
    document.getElementById('yearOfGraduation').addEventListener('input', function() {
        document.getElementById('display-grad-year').innerText = `Year of Graduation: ${this.value}`;
    });
    
    document.getElementById('companyName').addEventListener('input', function() {
        document.getElementById('display-company').innerText = this.value || 'Company Name';
    });
    
    document.getElementById('role').addEventListener('input', function() {
        document.getElementById('display-role').innerText = `Role: ${this.value}`;
    });
    
    document.getElementById('duration').addEventListener('input', function() {
        document.getElementById('display-duration').innerText = `Duration: ${this.value}`;
    });
    
    document.getElementById('responsibilities').addEventListener('input', function() {
        const responsibilities = this.value.split('\n');
        const responsibilitiesList = document.getElementById('display-responsibilities');
        responsibilitiesList.innerHTML = ''; // Clear previous responsibilities
        responsibilities.forEach(responsibility => {
            const li = document.createElement('li');
            li.innerText = responsibility;
            responsibilitiesList.appendChild(li);
        });
    });
});
