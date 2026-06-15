import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../ProductCard';

const mockProps = {
  title: 'Laptop Dell XPS 15',
  price: '150000',
  image: '/test-image.jpg',
  rating: 4,
  reviews: 120
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProductCard', () => {
  it('should render product title', () => {
    renderWithRouter(<ProductCard {...mockProps} />);
    expect(screen.getByText('Laptop Dell XPS 15')).toBeInTheDocument();
  });

  it('should render product price', () => {
    renderWithRouter(<ProductCard {...mockProps} />);
    expect(screen.getByText(/MT 150000/i)).toBeInTheDocument();
  });

  it('should render old price when provided', () => {
    renderWithRouter(<ProductCard {...mockProps} oldPrice="200000" />);
    expect(screen.getByText(/MT 200000/i)).toBeInTheDocument();
  });

  it('should render store name when provided', () => {
    renderWithRouter(<ProductCard {...mockProps} storeName="TechStore" />);
    expect(screen.getByText(/Por: TechStore/i)).toBeInTheDocument();
  });

  it('should render badge when provided', () => {
    renderWithRouter(<ProductCard {...mockProps} badge="Novo" />);
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should render correct number of reviews', () => {
    renderWithRouter(<ProductCard {...mockProps} />);
    expect(screen.getByText('(120)')).toBeInTheDocument();
  });

  it('should have accessible rating label', () => {
    renderWithRouter(<ProductCard {...mockProps} />);
    expect(screen.getByLabelText(/Avaliação: 4 de 5 estrelas/i)).toBeInTheDocument();
  });

  it('should render add to cart button', () => {
    renderWithRouter(<ProductCard {...mockProps} />);
    expect(screen.getByLabelText(/Adicionar ao carrinho/i)).toBeInTheDocument();
  });
});
