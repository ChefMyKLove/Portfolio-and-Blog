// Order page functionality
const BACKEND_URL = 'https://portfolio-and-blog-production.up.railway.app';

// Price mapping (in CAD)
const PRICES = {
  '8x10': 25,
  '12x16': 35,
  '16x20': 45,
  '18x24': 55,
  '24x36': 75
};

// Get artwork info from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const artworkImage = urlParams.get('image');
const artworkTitle = urlParams.get('title');
const printfulProductId = urlParams.get('productId');

// Load page
document.addEventListener('DOMContentLoaded', () => {
  if (!artworkImage || !artworkTitle) {
    document.getElementById('loading').innerHTML = '<h2>Invalid artwork link</h2>';
    return;
  }
  
  // Set artwork details
  document.getElementById('artwork-image').src = artworkImage;
  document.getElementById('artwork-title').textContent = artworkTitle;
  
  // Show order form
  document.getElementById('loading').style.display = 'none';
  document.getElementById('order-content').style.display = 'block';
  
  // Set up event listeners
  document.getElementById('size').addEventListener('change', updatePricing);
  document.getElementById('quantity').addEventListener('change', updatePricing);
  document.getElementById('order-form').addEventListener('submit', handleOrderSubmit);
});

// Update pricing based on selections
function updatePricing() {
  const sizeSelect = document.getElementById('size');
  const quantity = parseInt(document.getElementById('quantity').value) || 1;
  
  if (!sizeSelect.value) return;
  
  const basePrice = PRICES[sizeSelect.value];
  const subtotal = basePrice * quantity;
  const shipping = 10; // Flat rate for now
  const taxRate = 0.13; // 13% HST for Ontario/BC
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;
  
  // Update display
  document.getElementById('summary-size').textContent = sizeSelect.options[sizeSelect.selectedIndex].text.split('-')[0].trim();
  document.getElementById('price-print').textContent = `$${basePrice.toFixed(2)}`;
  document.getElementById('price-quantity').textContent = quantity;
  document.getElementById('price-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('price-shipping').textContent = `$${shipping.toFixed(2)}`;
  document.getElementById('price-tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('price-total').textContent = `$${total.toFixed(2)}`;
}

// Handle order submission
async function handleOrderSubmit(e) {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';
  
  const errorDiv = document.getElementById('error-message');
  errorDiv.style.display = 'none';
  
  try {
    // Collect form data
    const formData = new FormData(e.target);
    const orderData = {
      artwork: {
        image: artworkImage,
        title: artworkTitle,
        productId: printfulProductId
      },
      recipient: {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address1: formData.get('address1'),
        address2: formData.get('address2'),
        city: formData.get('city'),
        state_code: formData.get('state'),
        country_code: formData.get('country'),
        zip: formData.get('zip')
      },
      items: [{
        variant_id: getPrintfulVariantId(formData.get('size')),
        quantity: parseInt(formData.get('quantity')),
        retail_price: PRICES[formData.get('size')].toFixed(2)
      }]
    };
    
    // For now, just show success (payment integration coming next)
    console.log('Order data:', orderData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show success
    document.getElementById('order-form').style.display = 'none';
    document.getElementById('success').style.display = 'block';
    document.getElementById('order-id').textContent = 'ORD-' + Date.now();
    
  } catch (error) {
    console.error('Order error:', error);
    errorDiv.textContent = 'Failed to process order. Please try again or contact support.';
    errorDiv.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Proceed to Payment';
  }
}

// Map size to Printful variant ID (you'll need to get these from Printful API)
function getPrintfulVariantId(size) {
  // These are placeholder IDs - you'll get real ones from Printful
  const variantMap = {
    '8x10': 4381,
    '12x16': 4382,
    '16x20': 4383,
    '18x24': 4384,
    '24x36': 4385
  };
  return variantMap[size];
}
