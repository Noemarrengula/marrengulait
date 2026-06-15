// Script para popular base de dados com produtos de exemplo
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ynfnegxufykueofehvzm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZm5lZ3h1ZnlrdWVvZmVodnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTA5MzgsImV4cCI6MjA3OTEyNjkzOH0.BmLSptmvf9Q4XLzWG7ZiO3I40Ay5luJgHMNE0dCtUKg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const products = [
  {
    title: 'Laptop HP ProBook 450 G10',
    description: 'Intel Core i7 13th Gen, 16GB RAM, 512GB SSD, Windows 11 Pro',
    price: 89999.00,
    old_price: 105000.00,
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    category: 'Laptops',
    brand: 'HP',
    rating: 4.5,
    reviews_count: 127,
    stock: 15,
    store_name: 'TechStore Maputo',
    featured: true
  },
  {
    title: 'NVIDIA GeForce RTX 4070 Ti',
    description: '12GB GDDR6X, Ray Tracing, DLSS 3.0',
    price: 72500.00,
    old_price: null,
    image_url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800',
    category: 'Hardware',
    brand: 'NVIDIA',
    rating: 5.0,
    reviews_count: 189,
    stock: 8,
    store_name: 'Hardware Pro',
    featured: true
  },
  {
    title: 'Samsung 27" Monitor Curvo',
    description: '144Hz Gaming, 1ms, FreeSync Premium, WQHD',
    price: 18900.00,
    old_price: 22000.00,
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
    category: 'Monitores',
    brand: 'Samsung',
    rating: 4.0,
    reviews_count: 567,
    stock: 23,
    store_name: 'Display Tech',
    featured: false
  },
  {
    title: 'Teclado Mecânico RGB Logitech G915',
    description: 'TKL Wireless, Low Profile, LIGHTSPEED',
    price: 12500.00,
    old_price: null,
    image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800',
    category: 'Acessórios',
    brand: 'Logitech',
    rating: 5.0,
    reviews_count: 342,
    stock: 45,
    store_name: 'Periféricos MZ',
    featured: true
  },
  {
    title: 'Dell XPS 15',
    description: 'Intel i9, 32GB RAM, 1TB SSD, RTX 4060',
    price: 145000.00,
    old_price: 160000.00,
    image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
    category: 'Laptops',
    brand: 'Dell',
    rating: 4.8,
    reviews_count: 234,
    stock: 7,
    store_name: 'Premium Tech',
    featured: true
  },
  {
    title: 'Mouse Razer DeathAdder V3',
    description: 'Wireless, 30K DPI, 90h bateria',
    price: 4500.00,
    old_price: 5200.00,
    image_url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800',
    category: 'Acessórios',
    brand: 'Razer',
    rating: 4.7,
    reviews_count: 891,
    stock: 67,
    store_name: 'Gaming Store',
    featured: false
  },
  {
    title: 'SSD Samsung 990 PRO 2TB',
    description: 'NVMe PCIe 4.0, 7450MB/s leitura',
    price: 15800.00,
    old_price: null,
    image_url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800',
    category: 'Hardware',
    brand: 'Samsung',
    rating: 5.0,
    reviews_count: 445,
    stock: 34,
    store_name: 'Storage Pro',
    featured: false
  },
  {
    title: 'Webcam Logitech C920 HD Pro',
    description: 'Full HD 1080p, 30fps, Microfone estéreo',
    price: 3200.00,
    old_price: 3800.00,
    image_url: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800',
    category: 'Acessórios',
    brand: 'Logitech',
    rating: 4.3,
    reviews_count: 678,
    stock: 89,
    store_name: 'Periféricos MZ',
    featured: false
  }
];

async function seedDatabase() {
  console.log('🌱 Populando base de dados...\n');

  const { data, error } = await supabase
    .from('products')
    .insert(products)
    .select();

  if (error) {
    console.error('❌ Erro ao inserir produtos:', error.message);
    return;
  }

  console.log(`✅ ${data.length} produtos inseridos com sucesso!\n`);
  
  data.forEach((product, index) => {
    console.log(`${index + 1}. ${product.title} - ${product.price} MT`);
  });
}

seedDatabase();
