import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wtdrickycpxtvtmkwehz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0ZHJpY2t5Y3B4dHZ0bWt3ZWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMTAyOTUsImV4cCI6MjA5NjY4NjI5NX0.OtfS62khadgqdBjI9k9ADXsDqwg8w77RMi9Bymrf850';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const newProperties = [
  {
    title: 'Modern Desert Oasis',
    location: 'Phoenix, AZ',
    price: 1100000,
    beds: 4,
    baths: 3,
    area: 2800,
    image_alt: 'Modern house in the desert',
    status: 'FOR SALE',
    is_featured: false,
    slug: 'modern-desert-oasis-az',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
    lat: 33.4484,
    lng: -112.0740
  },
  {
    title: 'Downtown Tech Loft',
    location: 'San Jose, CA',
    price: 3500,
    price_suffix: '/mo',
    beds: 1,
    baths: 1,
    area: 950,
    image_alt: 'Modern loft interior',
    status: 'FOR RENT',
    is_featured: false,
    slug: 'downtown-tech-loft-ca',
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80'],
    lat: 37.3382,
    lng: -121.8863
  },
  {
    title: 'Mountain View Chalet',
    location: 'Denver, CO',
    price: 2400000,
    beds: 5,
    baths: 4.5,
    area: 4200,
    image_alt: 'Cozy chalet with mountain views',
    status: 'FOR SALE',
    is_featured: false,
    slug: 'mountain-view-chalet-co',
    images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80'],
    lat: 39.7392,
    lng: -104.9903
  },
  {
    title: 'Luxury Seaside Villa',
    location: 'Santa Barbara, CA',
    price: 5900000,
    beds: 6,
    baths: 6,
    area: 6500,
    image_alt: 'Villa by the sea',
    status: 'Exclusive',
    is_featured: false,
    slug: 'luxury-seaside-villa-ca',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
    lat: 34.4208,
    lng: -119.6982
  },
  {
    title: 'Historic Townhouse',
    location: 'Boston, MA',
    price: 4200,
    price_suffix: '/mo',
    beds: 3,
    baths: 2.5,
    area: 2100,
    image_alt: 'Brick townhouse in Boston',
    status: 'FOR RENT',
    is_featured: false,
    slug: 'historic-townhouse-ma',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
    lat: 42.3601,
    lng: -71.0589
  },
  {
    title: 'Minimalist Eco Home',
    location: 'Portland, OR',
    price: 850000,
    beds: 3,
    baths: 2,
    area: 1800,
    image_alt: 'Eco friendly home',
    status: 'New Arrival',
    is_featured: false,
    slug: 'minimalist-eco-home-or',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
    lat: 45.5152,
    lng: -122.6784
  },
  {
    title: 'High-rise Executive Condo',
    location: 'Chicago, IL',
    price: 1250000,
    beds: 2,
    baths: 2,
    area: 1500,
    image_alt: 'Executive condo in high-rise',
    status: 'FOR SALE',
    is_featured: false,
    slug: 'high-rise-executive-condo-il',
    images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80'],
    lat: 41.8781,
    lng: -87.6298
  },
  {
    title: 'Spacious Family Retreat',
    location: 'Austin, TX',
    price: 950000,
    beds: 4,
    baths: 3,
    area: 3200,
    image_alt: 'Large family home in Austin',
    status: 'FOR SALE',
    is_featured: false,
    slug: 'spacious-family-retreat-tx',
    images: ['https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80'],
    lat: 30.2672,
    lng: -97.7431
  },
  {
    title: 'Beachfront Bungalow',
    location: 'Miami, FL',
    price: 5500,
    price_suffix: '/mo',
    beds: 2,
    baths: 2,
    area: 1200,
    image_alt: 'Bungalow on the beach',
    status: 'FOR RENT',
    is_featured: false,
    slug: 'beachfront-bungalow-fl',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
    lat: 25.7617,
    lng: -80.1918
  },
  {
    title: 'Ultra-Modern Glass Villa',
    location: 'Seattle, WA',
    price: 3800000,
    beds: 5,
    baths: 4,
    area: 5000,
    image_alt: 'Glass villa surrounded by trees',
    status: 'Exclusive',
    is_featured: false,
    slug: 'ultra-modern-glass-villa-wa',
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'],
    lat: 47.6062,
    lng: -122.3321
  }
];

async function seed() {
  console.log('Inserting properties...');
  const { data, error } = await supabase.from('properties').insert(newProperties).select();
  if (error) {
    console.error('Error inserting:', error);
  } else {
    console.log('Successfully inserted', data.length, 'properties.');
  }
}

seed();
