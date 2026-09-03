import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Star, Search, Navigation, User, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = window.location.port === '5000'
  ? '/api'
  : `http://${window.location.hostname}:5000/api`;

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

type UserProfile = {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  phone: string;
  travelConsistency: number;
};

type AuthMode = 'login' | 'signup';

type AuthResponse = {
  success: boolean;
  message: string;
  user?: UserProfile;
};

type BookingStatus = 'submitting' | 'success' | 'error' | null;

type LocationSelectionProps = {
  selectedState: string;
  selectedPlace: string;
  onStateChange: (state: string) => void;
  onPlaceChange: (place: string) => void;
  onConfirm: () => void;
  onBack: () => void;
};

function LocationSelection({ selectedState, selectedPlace, onStateChange, onPlaceChange, onConfirm, onBack }: LocationSelectionProps) {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="max-w-2xl mb-10">
        <p className="text-sm font-bold uppercase tracking-wider text-orange-600">Destinations</p>
        <h1 className="text-4xl font-bold text-slate-800 mt-2">Choose your location</h1>
        <p className="text-slate-500 mt-3">Select a state first, then choose a place to explore.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <section aria-labelledby="state-list-title">
          <h2 id="state-list-title" className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3">Choose state</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(STATE_PLACES).map((state) => (
              <button
                key={state}
                type="button"
                onClick={() => onStateChange(state)}
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
        </section>

        <section className={`rounded-2xl border p-6 ${selectedState ? 'bg-orange-50 border-orange-200' : 'bg-slate-100 border-slate-200'}`} aria-labelledby="place-list-title">
          <h2 id="place-list-title" className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-4">
            {selectedState ? `Choose place in ${STATE_LABELS[selectedState]}` : 'Choose place'}
          </h2>
          {selectedState ? (
            <div className="flex flex-wrap gap-3">
              {STATE_PLACES[selectedState].map((place) => (
                <button
                  key={place}
                  type="button"
                  onClick={() => onPlaceChange(place)}
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
            <p className="text-slate-500">Select a state to see its places.</p>
          )}
          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onBack} className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-white">Back</button>
            <button type="button" onClick={onConfirm} disabled={!selectedState || !selectedPlace} className="px-6 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50">OK</button>
          </div>
        </section>
      </div>
    </main>
  );
}

function AuthView({
  authMode,
  onModeChange,
  onLogin,
  onSignup,
  isSubmitting,
  errorMessage
}: {
  authMode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onLogin: (payload: { username: string; password: string }) => void;
  onSignup: (payload: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    travelConsistency: number;
  }) => void;
  isSubmitting: boolean;
  errorMessage: string;
}) {
  const [loginForm, setLoginForm] = React.useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = React.useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    travelConsistency: 3
  });

  const travelConsistencyLabel = (value: number) => {
    if (value === 0) return '0 = None';
    if (value >= 1 && value <= 2) return '1-2 = Fair';
    if (value >= 3 && value <= 4) return '3-4 = Good';
    return '5 = Better / Excellent';
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed,_#fff,_#f8fafc)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-[0_30px_80px_rgba(15,23,42,0.12)] overflow-hidden border border-orange-100">
        <div className="grid lg:grid-cols-2">
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 p-10 text-white">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <Navigation className="w-8 h-8" />
                <span className="text-2xl font-bold">Incredible<span className="text-orange-100">India</span></span>
              </div>
              <h1 className="text-4xl font-black leading-tight mb-5">Plan your next unforgettable journey.</h1>
              <p className="text-orange-50 text-lg">Discover heritage stays, scenic escapes, and personalized travel experiences tailored to your rhythm.</p>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-orange-100">Travel Consistency</p>
              <p className="mt-2 text-3xl font-bold">0 to 5 scale</p>
              <p className="mt-2 text-sm text-orange-100">0 = None • 1-2 = Fair • 3-4 = Good • 5 = Better / Excellent</p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex justify-center mb-8 rounded-full bg-orange-50 p-1 w-full max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => onModeChange('login')}
                className={`flex-1 py-2.5 rounded-full font-semibold transition-colors ${authMode === 'login' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => onModeChange('signup')}
                className={`flex-1 py-2.5 rounded-full font-semibold transition-colors ${authMode === 'signup' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600'}`}
              >
                Sign Up
              </button>
            </div>

            {errorMessage && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4" />
                {errorMessage}
              </div>
            )}

            {authMode === 'login' ? (
              <form
                className="space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  onLogin(loginForm);
                }}
              >
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Username</label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(event) => setLoginForm({ ...loginForm, username: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-200"
                    placeholder="Enter username or email"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-200"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-orange-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
                  Continue with Google
                </button>
              </form>
            ) : (
              <form
                className="space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  onSignup(signupForm);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
                    <input
                      type="text"
                      value={signupForm.name}
                      onChange={(event) => setSignupForm({ ...signupForm, name: event.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-200"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Surname</label>
                    <input
                      type="text"
                      value={signupForm.surname}
                      onChange={(event) => setSignupForm({ ...signupForm, surname: event.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-200"
                      placeholder="Enter your surname"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Email ID</label>
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={(event) => setSignupForm({ ...signupForm, email: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-200"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    value={signupForm.phone}
                    onChange={(event) => setSignupForm({ ...signupForm, phone: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-200"
                    placeholder="9876543210"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                    <input
                      type="password"
                      value={signupForm.password}
                      onChange={(event) => setSignupForm({ ...signupForm, password: event.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-200"
                      placeholder="Create password"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm Password</label>
                    <input
                      type="password"
                      value={signupForm.confirmPassword}
                      onChange={(event) => setSignupForm({ ...signupForm, confirmPassword: event.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-200"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="text-sm font-semibold text-slate-700">Travel Consistency within a year</label>
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-orange-700">{signupForm.travelConsistency}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={1}
                    value={signupForm.travelConsistency}
                    onChange={(event) => setSignupForm({ ...signupForm, travelConsistency: Number(event.target.value) })}
                    className="h-2 w-full accent-orange-600"
                  />
                  <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span>0 = None</span>
                    <span>1-2 = Fair</span>
                    <span>3-4 = Good</span>
                    <span>5 = Better / Excellent</span>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-orange-700">Current: {travelConsistencyLabel(signupForm.travelConsistency)}</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-orange-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutView({ onBack }: { onBack: () => void }) {
  const importantLinks = [
    { label: 'Incredible India', href: 'https://www.incredibleindia.gov.in/', description: 'Official destination inspiration from the Ministry of Tourism.' },
    { label: 'India.gov.in', href: 'https://www.india.gov.in/', description: 'Government services, travel information, and visitor resources.' },
    { label: 'Indian Railways', href: 'https://www.irctc.co.in/', description: 'Check train routes, schedules, and ticket availability.' },
    { label: 'Emergency services', href: 'tel:112', description: 'Call 112 for urgent assistance anywhere in India.' }
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <button type="button" onClick={onBack} className="mb-8 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700">
          Back to destinations
        </button>

        <section className="relative overflow-hidden rounded-[32px] bg-slate-900 px-7 py-12 text-white shadow-xl sm:px-12">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-25" />
          <div className="relative max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-orange-400">About Incredible India</p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">Travel with more curiosity and less guesswork.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">Our objective is to make exploring India simple, personal, and inspiring by bringing destinations, local experiences, and trip planning into one welcoming place.</p>
          </div>
        </section>

        <section className="grid gap-5 py-10 md:grid-cols-3" aria-label="App objectives">
          <article className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <MapPin className="mb-4 h-8 w-8 text-orange-600" />
            <h2 className="text-xl font-bold text-slate-800">Discover deeply</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Find heritage, nature, adventure, spiritual, and relaxation destinations across India.</p>
          </article>
          <article className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <Calendar className="mb-4 h-8 w-8 text-orange-600" />
            <h2 className="text-xl font-bold text-slate-800">Plan confidently</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Compare options, choose a location, and send an inquiry for a more tailored journey.</p>
          </article>
          <article className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <Star className="mb-4 h-8 w-8 text-orange-600" />
            <h2 className="text-xl font-bold text-slate-800">Travel personally</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Use your travel preferences to shape experiences that suit your pace and interests.</p>
          </article>
        </section>

        <section className="border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-bold text-slate-800">Important links</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {importantLinks.map((link) => (
              <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-800">{link.label}</h3>
                  <span className="text-orange-600" aria-hidden="true">↗</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{link.description}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function ExperiencesView({ onBack }: { onBack: () => void }) {
  const stories = [
    {
      name: 'Riya Mehta',
      trip: 'Slow mornings in Kerala',
      quote: 'The location suggestions helped us trade a rushed itinerary for quiet houseboat mornings and the best local food of our trip.',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=900&auto=format&fit=crop'
    },
    {
      name: 'Arjun Kapoor',
      trip: 'A first Himalayan adventure',
      quote: 'I had never planned a mountain trip before. The simple destination cards gave me the confidence to finally book Ladakh.',
      image: 'https://images.unsplash.com/photo-1626014903706-59d8f6d65406?q=80&w=900&auto=format&fit=crop'
    },
    {
      name: 'The Fernandes family',
      trip: 'A heritage weekend in Jaipur',
      quote: 'Everyone found something to enjoy, from the forts to the food. Our family inquiry made planning for all ages feel easy.',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=900&auto=format&fit=crop'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <button type="button" onClick={onBack} className="mb-8 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700">
          Back to destinations
        </button>

        <section className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Experiences</p>
          <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl">Real journeys, remembered in their own words.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-500">See how other travelers used Incredible India to find a pace, place, and story that felt like theirs.</p>
        </section>

        <section className="grid gap-7 md:grid-cols-3" aria-label="Customer travel stories">
          {stories.map((story) => (
            <article key={story.name} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <img src={story.image} alt={story.trip} className="h-56 w-full object-cover" />
              <div className="p-6">
                <p className="text-sm font-bold uppercase tracking-wide text-orange-600">{story.trip}</p>
                <blockquote className="mt-4 text-lg font-medium leading-8 text-slate-700">&quot;{story.quote}&quot;</blockquote>
                <p className="mt-5 text-sm font-bold text-slate-900">{story.name}</p>
                <p className="mt-1 text-sm text-slate-500">Verified Incredible India traveler</p>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-3xl bg-orange-600 px-7 py-9 text-white sm:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold">Your story could be next.</h2>
              <p className="mt-2 max-w-xl text-orange-100">Choose a destination and send an inquiry to start shaping your own Indian travel experience.</p>
            </div>
            <button type="button" onClick={onBack} className="rounded-xl bg-white px-5 py-3 font-bold text-orange-700 transition hover:bg-orange-50">Explore destinations</button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function App() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [confirmedLocation, setConfirmedLocation] = useState("");
  const [showLocationSelection, setShowLocationSelection] = useState(false);
  
  // Modal / Booking State
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [sessionUser, setSessionUser] = useState<UserProfile | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showExperiences, setShowExperiences] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      // Attempt to connect to the Node.js backend
      const response = await fetch(`${API_BASE_URL}/destinations`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setDestinations(data);
      setBackendConnected(true);
    } catch {
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
      const response = await fetch(`${API_BASE_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Failed to submit');
      
      setBookingStatus('success');
    } catch {
      setBookingStatus('error');
    }
  };

  const closeBookingModal = () => {
    setSelectedDestination(null);
    setBookingStatus(null);
  };

  const handleLogin = async (payload: { username: string; password: string }) => {
    setAuthError('');
    setAuthSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data: AuthResponse = await response.json();
      if (!response.ok || !data.success || !data.user) {
        throw new Error(data.message || 'Unable to log in.');
      }

      setSessionUser(data.user);
      setAuthMode('login');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to log in.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignup = async (payload: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    travelConsistency: number;
  }) => {
    setAuthError('');
    setAuthSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data: AuthResponse = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to create account.');
      }

      setAuthMode('login');
      setAuthError('');
      setSessionUser(data.user ?? null);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to create account.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const openLocationSelection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowLocationSelection(true);
    setShowExperiences(false);
    setShowAboutUs(false);
  };

  const openAboutUs = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowAboutUs(true);
    setShowExperiences(false);
    setShowLocationSelection(false);
  };

  const openExperiences = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowExperiences(true);
    setShowAboutUs(false);
    setShowLocationSelection(false);
  };

  if (!sessionUser) {
    return (
      <AuthView
        authMode={authMode}
        onModeChange={setAuthMode}
        onLogin={handleLogin}
        onSignup={handleSignup}
        isSubmitting={authSubmitting}
        errorMessage={authError}
      />
    );
  }

  const confirmLocation = () => {
    if (!selectedState || !selectedPlace) return;
    setConfirmedLocation(`${selectedPlace}, ${STATE_LABELS[selectedState]}`);
    setShowLocationSelection(false);
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
          <a href="#destinations" onClick={openLocationSelection} className="hover:text-orange-600 transition-colors">Destinations</a>
          <a href="#experiences" onClick={openExperiences} className="hover:text-orange-600 transition-colors">Experiences</a>
          <a href="#about-us" onClick={openAboutUs} className="hover:text-orange-600 transition-colors">About Us</a>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700">
            {sessionUser.name}
          </div>
          <button
            type="button"
            onClick={() => setSessionUser(null)}
            className="bg-orange-600 text-white px-5 py-2 rounded-full font-medium hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
          >
            Logout
          </button>
        </div>
      </nav>

      {showExperiences ? (
        <ExperiencesView onBack={() => setShowExperiences(false)} />
      ) : showAboutUs ? (
        <AboutView onBack={() => setShowAboutUs(false)} />
      ) : showLocationSelection ? (
        <LocationSelection
          selectedState={selectedState}
          selectedPlace={selectedPlace}
          onStateChange={(state) => { setSelectedState(state); setSelectedPlace(""); }}
          onPlaceChange={setSelectedPlace}
          onConfirm={confirmLocation}
          onBack={() => setShowLocationSelection(false)}
        />
      ) : (
      <>

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
          {confirmedLocation && (
            <p className="mt-5 rounded-full bg-white/95 px-5 py-2 text-sm font-semibold text-slate-800 shadow-lg">
              Selected location: {confirmedLocation}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">

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

      </>
      )}

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
              ) : bookingStatus === 'error' ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-slate-800 mb-2">Request not sent</h4>
                  <p className="text-slate-500 mb-6">We could not reach the travel server. Please try again when the API is available.</p>
                  <button
                    onClick={() => setBookingStatus(null)}
                    className="w-full bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700"
                  >
                    Try Again
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