
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
function validateForm() {
    const phone = document.getElementById('phone').value;
    const ifsc = document.getElementById('ifsc').value;
    const accountNumber = document.getElementById('account-number').value;

    if (phone.length !== 10) {
        alert("Phone number must be 10 digits");
        return false;
    }

    const ifscPattern = /^[A-Za-z]{4}[a-zA-Z0-9]{7}$/;
    if (!ifscPattern.test(ifsc)) {
        alert("Invalid IFSC Code");
        return false;
    }

    if (accountNumber.length < 9 || accountNumber.length > 18) {
        alert("Account number must be between 9 and 18 digits");
        return false;
    }

    return true;
}


