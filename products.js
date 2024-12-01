class ProductManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || this.getDefaultProducts();
        this.setupImagePreview();
    }

    getDefaultProducts() {
        const defaultProducts = [
            // Fruits Category
            {
                id: '1',
                farmerId: 'default',
                farmerName: 'Local Farm',
                name: 'Organic Apples',
                category: 'Fruits',
                price: 5.99,
                unit: 'kg',
                quantity: 100,
                description: 'Fresh organic apples',
                image: '/Assets/product1.jpeg'
            },
            {
                id: '2',
                farmerId: 'default',
                farmerName: 'Sunshine Orchards',
                name: 'Sweet Mangoes',
                category: 'Fruits',
                price: 7.99,
                unit: 'kg',
                quantity: 80,
                description: 'Ripe and sweet mangoes',
                image: '/Assets/product8.jpeg'
            },
            {
                id: '3',
                farmerId: 'default',
                farmerName: 'Fresh Fields',
                name: 'Organic Bananas',
                category: 'Fruits',
                price: 4.99,
                unit: 'kg',
                quantity: 150,
                description: 'Fresh organic bananas',
                image: '/Assets/product6.jpeg'
            },
            // Vegetables Category
            {
                id: '4',
                farmerId: 'default',
                farmerName: 'Green Valley Farm',
                name: 'Fresh Tomatoes',
                category: 'Vegetables',
                price: 3.99,
                unit: 'kg',
                quantity: 50,
                description: 'Ripe red tomatoes',
                image: '/Assets/product2.jpeg'
            },
            {
                id: '5',
                farmerId: 'default',
                farmerName: 'Organic Greens',
                name: 'Fresh Spinach',
                category: 'Vegetables',
                price: 2.99,
                unit: 'bunch',
                quantity: 100,
                description: 'Organic spinach leaves',
                image: '/Assets/spinach.jpeg'
            },
            {
                id: '6',
                farmerId: 'default',
                farmerName: 'Farm Fresh',
                name: 'Carrots',
                category: 'Vegetables',
                price: 2.49,
                unit: 'kg',
                quantity: 120,
                description: 'Fresh organic carrots',
                image: '/Assets/product5.jpeg'
            },
            // Grains Category
            {
                id: '7',
                farmerId: 'default',
                farmerName: 'Nature\'s Best',
                name: 'Brown Rice',
                category: 'Grains',
                price: 4.99,
                unit: 'kg',
                quantity: 200,
                description: 'Organic brown rice',
                image: '/Assets/product7rice.jpeg'
            },
            {
                id: '8',
                farmerId: 'default',
                farmerName: 'Golden Fields',
                name: 'Organic Wheat',
                category: 'Grains',
                price: 3.99,
                unit: 'kg',
                quantity: 250,
                description: 'Premium organic wheat',
                image: '/Assets/product3.jpeg'
            },
            // Dairy Category
            {
                id: '9',
                farmerId: 'default',
                farmerName: 'Happy Farms',
                name: 'Farm Fresh Eggs',
                category: 'Dairy',
                price: 5.99,
                unit: 'dozen',
                quantity: 100,
                description: 'Free-range organic eggs',
                image: '/Assets/product8eggs.jpeg'
            },
            {
                id: '10',
                farmerId: 'default',
                farmerName: 'Dairy Delight',
                name: 'Organic Milk',
                category: 'Dairy',
                price: 4.99,
                unit: 'liter',
                quantity: 50,
                description: 'Fresh organic milk',
                image: '/Assets/milk.jpeg'
            }
        ];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
        return defaultProducts;
    }

    setupImagePreview() {
        const imageInput = document.getElementById('product-image');
        const imagePreview = document.getElementById('image-preview');

        if (imageInput && imagePreview) {
            imageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    initializeManagement() {
        this.setupAddProductForm();
        this.displayFarmerProducts();
    }

    setupAddProductForm() {
        const form = document.getElementById('add-product-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addProduct(form);
            });
        }
    }

    async addProduct(form) {
        const imageFile = form.image.files[0];
        if (!imageFile) {
            alert('Please select an image for the product');
            return;
        }

        // Convert image to base64
        const imageBase64 = await this.getBase64(imageFile);

        const product = {
            id: Date.now().toString(),
            farmerId: auth.currentUser.id,
            farmerName: auth.currentUser.fullname,
            name: form.name.value,
            category: form.category.value,
            price: parseFloat(form.price.value),
            unit: form.unit.value,
            quantity: parseInt(form.quantity.value),
            description: form.description.value,
            image: imageBase64,
            dateAdded: new Date().toISOString()
        };

        this.products.push(product);
        this.saveProducts();
        this.displayFarmerProducts();
        form.reset();
        document.getElementById('image-preview').innerHTML = '';
        alert('Product added successfully!');
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    getFarmerProducts() {
        return this.products.filter(product => product.farmerId === auth.currentUser.id);
    }

    displayFarmerProducts() {
        const productsContainer = document.getElementById('farmer-products');
        if (!productsContainer) return;

        const farmerProducts = this.getFarmerProducts();
        productsContainer.innerHTML = farmerProducts.map(product => `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)} per ${product.unit}</p>
                    <p class="quantity">Stock: ${product.quantity} ${product.unit}</p>
                    <div class="product-actions">
                        <button onclick="products.editProduct('${product.id}')" class="edit-btn">Edit</button>
                        <button onclick="products.deleteProduct('${product.id}')" class="delete-btn">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Implement edit functionality
        // For now, just show an alert
        alert('Edit functionality coming soon!');
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.saveProducts();
            this.displayFarmerProducts();
        }
    }

    getAllProducts() {
        return this.products;
    }

    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }
}

// Initialize product manager
const products = new ProductManager();
