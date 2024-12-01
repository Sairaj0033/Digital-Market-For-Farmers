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

document.getElementById('join-farmer-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:5000/api/farmers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            // Redirect to home page after successful submission
            window.location.href = '/'; // Adjust the URL as needed
        } else {
            const errorData = await response.json();
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your details.');
    }
});

// Add product data
const products = [
    {
        id: 'apple1',
        name: 'Organic Apples',
        price: 5.99,
        image: '/Assets/product1.jpeg',
        category: 'Fruits'
    },
    {
        id: 'banana1',
        name: 'Fresh Bananas',
        price: 2.99,
        image: '/Assets/product2.jpeg',
        category: 'Fruits'
    },
    // Add more products here
];

// Initialize shopping cart
document.addEventListener('DOMContentLoaded', () => {
    // Add click event listeners to all buy now buttons
    const buyButtons = document.querySelectorAll('.buy-now');
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('p').textContent.replace('$', '').split(' ')[0]);
            const productImage = productCard.querySelector('img').src;
            
            const product = {
                id: productName.toLowerCase().replace(' ', '_'),
                name: productName,
                price: productPrice,
                image: productImage
            };
            
            cart.addItem(product);
            alert('Product added to cart!');
        });
    });
});
