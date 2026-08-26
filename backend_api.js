const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests from the React frontend
app.use(express.json()); // Parse incoming JSON requests

// In a real application, this data would come from MongoDB or PostgreSQL
const destinations = [
  {
    id: 1,
    name: "Taj Mahal, Agra",
    category: "Heritage",
    price: "$120",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1564507592208-528fd8b76c8c?q=80&w=800&auto=format&fit=crop",
    description: "Witness the ultimate symbol of love, an ivory-white marble mausoleum on the right bank of the river Yamuna."
  },
  {
    id: 2,
    name: "Backwaters, Kerala",
    category: "Nature",
    price: "$85",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop",
    description: "Cruise through the tranquil network of brackish lagoons and canals on a traditional houseboat."
  },
  {
    id: 3,
    name: "Pangong Lake, Ladakh",
    category: "Adventure",
    price: "$150",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1626014903706-59d8f6d65406?q=80&w=800&auto=format&fit=crop",
    description: "Experience the breathtaking high grassland lake with ever-changing vibrant blue waters."
  },
  {
    id: 4,
    name: "Hawa Mahal, Jaipur",
    category: "Heritage",
    price: "$90",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&auto=format&fit=crop",
    description: "Explore the 'Palace of Winds', a stunning pink-painted honeycomb hive constructed from red and pink sandstone."
  },
  {
    id: 5,
    name: "Varanasi Ghats",
    category: "Spiritual",
    price: "$60",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1561359313-0639aad3a644?q=80&w=800&auto=format&fit=crop",
    description: "Immerse yourself in the spiritual capital of India, watching the spectacular Ganga Aarti at sunset."
  },
  {
    id: 6,
    name: "Goa Beaches",
    category: "Relaxation",
    price: "$110",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop",
    description: "Relax on golden sands, enjoy vibrant nightlife, and explore beautiful Portuguese colonial architecture."
  }
];

// Store inquiries in memory (would be a DB table in production)
const inquiries = [];

// Root endpoint for quick browser checks
app.get('/', (req, res) => {
  res.json({
    message: 'Indian Tourism API is running.',
    endpoints: ['/api/health', '/api/destinations', '/api/inquiries']
  });
});

// GET: Fetch all destinations (with optional category filter)
app.get('/api/destinations', (req, res) => {
  try {
    const { category } = req.query;
    if (category && category !== 'All') {
      const filtered = destinations.filter(d => d.category === category);
      return res.json(filtered);
    }
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching destinations", error: error.message });
  }
});

// POST: Submit a booking inquiry
app.post('/api/inquiries', (req, res) => {
  try {
    const { name, email, destinationId, date, guests } = req.body;
    
    // Basic validation
    if (!name || !email || !destinationId) {
      return res.status(400).json({ message: "Name, email, and destination are required." });
    }

    const newInquiry = {
      id: inquiries.length + 1,
      name,
      email,
      destinationId,
      date,
      guests,
      timestamp: new Date().toISOString()
    };

    inquiries.push(newInquiry);
    console.log("New Inquiry Received:", newInquiry);

    res.status(201).json({ 
      success: true, 
      message: "Thank you! Your inquiry has been received. Our team will contact you shortly.",
      data: newInquiry
    });

  } catch (error) {
    res.status(500).json({ message: "Error processing inquiry", error: error.message });
  }
});

// GET: Fetch submitted booking inquiries
app.get('/api/inquiries', (req, res) => {
  res.json(inquiries);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: "Backend is running smoothly!" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Server running on port ${PORT}`);
    console.log(`Access API at http://localhost:${PORT}/api/destinations`);
    console.log(`=================================`);
  });
}

module.exports = app;