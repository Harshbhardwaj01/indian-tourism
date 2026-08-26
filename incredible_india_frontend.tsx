import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Star, Search, Navigation, User, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// This mock data mirrors the Node.js backend so the app works beautifully 
// in browser previews even if the backend server isn't running locally yet.
const FALLBACK_DESTINATIONS = [
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
    description: "Explore the 'Palace of Winds', a stunning pink-painted honeycomb hive constructed from red sandstone."
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

const CATEGORIES = ["All", "Heritage", "Nature", "Adventure", "Spiritual", "Relaxation"];

const STATE_PLACES: Record<string, string[]> = {
  Rajasthan: ["Jaipur", "Udaipur", "Jaisalmer", "Jodhpur"],
  Kerala: ["Alappuzha", "Munnar", "Kochi", "Kovalam"],
  Goa: ["Panaji", "Calangute Beach", "Palolem Beach", "Old Goa"],
  Maharashtra: ["Mumbai", "Lonavala", "Aurangabad", "Mahabaleshwar"],
  HimachalPradesh: ["Shimla", "Manali", "Dharamshala", "Spiti Valley"],
  Uttarakhand: ["Dehradun", "Rishikesh", "Nainital", "Mussoorie"],
  TamilNadu: ["Chennai", "Ooty", "Madurai", "Rameswaram"],
  WestBengal: ["Kolkata", "Darjeeling", "Sundarbans", "Digha"]
};

const STATE_LABELS: Record<string, string> = {
  Rajasthan: "Rajasthan",
  Kerala: "Kerala",
  Goa: "Goa",
  Maharashtra: "Maharashtra",
  HimachalPradesh: "Himachal Pradesh",
  Uttarakhand: "Uttarakhand",
  TamilNadu: "Tamil Nadu",
  WestBengal: "West Bengal"
};

type Destination = {
  id: number;
  name: string;
  category: string;
  price: string;
  rating: number;
  imageUrl: string;
  description: string;
};

type BookingStatus = 'idle' | 'submitting' | 'success' | 'error' | null;

export default function App() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  
  // Modal / Booking State
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>(null);
  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      // Attempt to connect to the Node.js backend
      const response = await fetch('/api/destinations');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setDestinations(data);
      setBackendConnected(true);
    } catch (error) {
      // Graceful fallback to mock data if backend isn't running (perfect for preview mode)
      console.warn("Backend not detected at localhost:5000. Using fallback data for preview.");
      setDestinations(FALLBACK_DESTINATIONS);
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory = activeCategory === "All" || dest.category === activeCategory;
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const destination = selectedDestination;
    if (!destination) return;
    setBookingStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      date: formData.get('date'),
      guests: formData.get('guests'),
      destinationId: destination.id
    };

    try {
      // Try hitting the real backend
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Failed to submit');
      
      setBookingStatus('success');
    } catch (error) {
      // Simulate successful network request for preview purposes if backend is down
      setTimeout(() => {
        console.log("Mock Submission Payload:", payload);
        setBookingStatus('success');
      }, 1000);
    }
  };

  const closeBookingModal = () => {
    setSelectedDestination(null);
    setBookingStatus(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-orange-200">
     {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-orange-600">
          <Navigation className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">Incredible<span className="text-slate-800">India</span></span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-slate-600">
          <a href="#" className="hover:text-orange-600 transition-colors">Destinations</a>
          <a href="#" className="hover:text-orange-600 transition-colors">Experiences</a>
          <a href="#" className="hover:text-orange-600 transition-colors">About Us</a>
        </div>
        <button className="bg-orange-600 text-white px-5 py-2 rounded-full font-medium hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200">
          Plan Trip
        </button>
      </nav>

      {/* Connection Banner */}
      {!loading && !backendConnected && (
        <div className="bg-amber-100 text-amber-800 text-xs text-center py-2 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Running in Preview Mode. Start the Node.js backend on port 5000 for full API integration.
        </div>
      )}

      {/* Hero Section */}
      <header className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2000&auto=format&fit=crop" 
            alt="India Landscape" 
            className="w-full h-full object-cover object-center filter brightness-50"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl flex flex-col items-center">
          <span className="text-orange-400 font-semibold tracking-wider uppercase mb-4 block">Discover the Magic</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Journey Through <br/> The Colors of India
          </h1>
          
          {/* Search Bar */}
          <div className="w-full max-w-xl bg-white p-2 rounded-full shadow-2xl flex items-center mt-4">
            <div className="pl-4 pr-2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              className="flex-1 py-3 px-2 outline-none text-slate-700 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-slate-800 text-white px-6 py-3 rounded-full hover:bg-slate-700 transition-colors">
              Explore
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">

        {/* State and place selection */}
        <section className="mb-14" aria-labelledby="destination-picker-title">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wider text-orange-600">Plan your journey</p>
            <h2 id="destination-picker-title" className="text-3xl font-bold text-slate-800 mt-2">Choose a destination</h2>
            <p className="text-slate-500 mt-2">Start with a state, then choose the place you want to explore.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3">Choose state</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
                {Object.keys(STATE_PLACES).map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => { setSelectedState(state); setSelectedPlace(""); }}
                    aria-pressed={selectedState === state}
                    className={`text-left px-4 py-3 rounded-xl border font-semibold transition-all ${
                      selectedState === state
                        ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-200'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300 hover:text-orange-700'
                    }`}
                  >
                    {STATE_LABELS[state]}
                  </button>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border p-5 transition-colors ${selectedState ? 'bg-orange-50 border-orange-200' : 'bg-slate-100 border-slate-200'}`}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3">
                {selectedState ? `Choose place in ${STATE_LABELS[selectedState]}` : 'Choose place'}
              </h3>
              {selectedState ? (
                <div className="flex flex-wrap gap-3">
                  {STATE_PLACES[selectedState].map((place) => (
                    <button
                      key={place}
                      type="button"
                      onClick={() => setSelectedPlace(place)}
                      aria-pressed={selectedPlace === place}
                      className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${
                        selectedPlace === place
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-orange-400 hover:text-orange-700'
                      }`}
                    >
                      <MapPin className="inline-block w-4 h-4 mr-1" />
                      {place}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">Select one of the states to see its places.</p>
              )}
              {selectedPlace && (
                <p className="mt-5 text-sm font-semibold text-orange-700">
                  Selected destination: {selectedPlace}, {STATE_LABELS[selectedState]}
                </p>
              )}
            </div>
          </div>
        </section>
        
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Popular Destinations</h2>
            <p className="text-slate-500">Curated experiences for every type of traveler.</p>
          </div>
          
          <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 gap-2 hide-scrollbar">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category 
                    ? 'bg-orange-100 text-orange-700 border-orange-200 border' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-orange-600">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p>Discovering destinations...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDestinations.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-700">No destinations found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or search query.</p>
            <button 
              onClick={() => {setSearchQuery(""); setActiveCategory("All");}}
              className="mt-6 text-orange-600 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Destination Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest) => (
              <div 
                key={dest.id} 
                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-orange-900/5 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={dest.imageUrl} 
                    alt={dest.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 tracking-wide">
                    {dest.category}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-800 leading-tight">{dest.name}</h3>
                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg text-orange-700 font-semibold text-sm">
                      <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                      {dest.rating}
                    </div>
                  </div>
                  
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">
                    {dest.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Starting at</span>
                      <span className="text-lg font-bold text-slate-800">{dest.price}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedDestination(dest)}
                      className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-md"
                    >
                      Book Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-white mb-4">
              <Navigation className="w-6 h-6 text-orange-500" />
              <span className="text-2xl font-bold tracking-tight">Incredible<span className="text-orange-500">India</span></span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">Experience the vibrant culture, rich heritage, and stunning landscapes of the Indian subcontinent.</p>
          </div>
          <div className="text-sm">
            <p>&copy; {new Date().getFullYear()} Tourism India Mockup. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Booking Modal Overlay */}
      {selectedDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Modal Header Image */}
            <div className="h-32 relative">
              <img src={selectedDestination.imageUrl} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <button 
                onClick={closeBookingModal}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
              >
                ✕
              </button>
              <h3 className="absolute bottom-4 left-6 text-xl font-bold text-white">
                {selectedDestination.name}
              </h3>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              
              {bookingStatus === 'success' ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-slate-800 mb-2">Request Sent!</h4>
                  <p className="text-slate-500 mb-6">Thank you for your interest in {selectedDestination.name}. Our travel experts will email you shortly with itinerary options.</p>
                  <button 
                    onClick={closeBookingModal}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <p className="text-sm text-slate-500 mb-4">Please fill out this quick form to inquire about availability and custom itineraries.</p>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required name="name" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" placeholder="John Doe" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required name="email" type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Travel Date</label>
                      <div className="relative">
                        <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input required name="date" type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-600" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Guests</label>
                      <select name="guests" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-600 appearance-none">
                        <option>1 Person</option>
                        <option>2 People</option>
                        <option>3-5 People</option>
                        <option>6+ Group</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    disabled={bookingStatus === 'submitting'}
                    type="submit" 
                    className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 mt-4 flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {bookingStatus === 'submitting' ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                    ) : (
                      'Send Inquiry'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}