// Printful API Integration
const express = require('express');
const router = express.Router();

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_BASE = 'https://api.printful.com';

if (!PRINTFUL_API_KEY) {
  console.error('⚠️ PRINTFUL_API_KEY not found in environment variables!');
}

// Get product details and pricing
router.get('/products/:templateId', async (req, res) => {
  try {
    const { templateId } = req.params;
    
    const response = await fetch(`${PRINTFUL_API_BASE}/product-templates/${templateId}`, {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.code === 200) {
      res.json(data.result);
    } else {
      res.status(400).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Printful API error:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// Calculate shipping costs
router.post('/shipping/calculate', async (req, res) => {
  try {
    const { items, recipient } = req.body;
    
    const response = await fetch(`${PRINTFUL_API_BASE}/shipping/rates`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient,
        items
      })
    });
    
    const data = await response.json();
    
    if (data.code === 200) {
      res.json(data.result);
    } else {
      res.status(400).json({ error: 'Failed to calculate shipping' });
    }
  } catch (error) {
    console.error('Shipping calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate shipping' });
  }
});

// Create order (after payment is confirmed)
router.post('/orders/create', async (req, res) => {
  try {
    const { recipient, items, retail_costs } = req.body;
    
    // Create order in Printful
    const response = await fetch(`${PRINTFUL_API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient,
        items,
        retail_costs,
        confirm: true // Auto-confirm order
      })
    });
    
    const data = await response.json();
    
    if (data.code === 200) {
      res.json({
        success: true,
        order: data.result
      });
    } else {
      res.status(400).json({ error: 'Failed to create order', details: data });
    }
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order status
router.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const response = await fetch(`${PRINTFUL_API_BASE}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.code === 200) {
      res.json(data.result);
    } else {
      res.status(400).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Order status error:', error);
    res.status(500).json({ error: 'Failed to fetch order status' });
  }
});

module.exports = router;
