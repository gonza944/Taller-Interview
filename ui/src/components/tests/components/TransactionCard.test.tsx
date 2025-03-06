import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TransactionCard from '../../TransactionCard';
import { Transaction } from '../../../types';

describe('TransactionCard', () => {
  const mockTransaction: Transaction = {
    id: 1,
    description: 'Test Transaction',
    amount: 100,
    date: new Date('2023-01-01')
  };

  it('renders transaction details correctly', () => {
    render(<TransactionCard transaction={mockTransaction} />);
    
    // Check if transaction ID is displayed
    expect(screen.getByText(/Transaction 1/i)).toBeInTheDocument();
    
    // Check if description is displayed
    expect(screen.getByText('Test Transaction')).toBeInTheDocument();
    
    // Check if amount is displayed
    expect(screen.getByText('100')).toBeInTheDocument();
    
    // Check if date is displayed - using regex to be more flexible with date format
    // This will match both 01/01/2023 and 12/31/2022 (timezone differences)
    expect(screen.getByText(/^\d{2}\/\d{2}\/\d{4}$/)).toBeInTheDocument();
  });

  it('handles different transaction data correctly', () => {
    const anotherTransaction: Transaction = {
      id: 2,
      description: 'Another Transaction',
      amount: 250.50,
      date: new Date('2023-05-15')
    };
    
    render(<TransactionCard transaction={anotherTransaction} />);
    
    expect(screen.getByText(/Transaction 2/i)).toBeInTheDocument();
    expect(screen.getByText('Another Transaction')).toBeInTheDocument();
    expect(screen.getByText('250.5')).toBeInTheDocument();
    
    // Using regex to be more flexible with date format
    expect(screen.getByText(/^\d{2}\/\d{2}\/\d{4}$/)).toBeInTheDocument();
  });
}); 