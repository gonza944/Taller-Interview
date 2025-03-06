import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { Transaction } from './types';

// Mock fetch API
const mockTransactions: Transaction[] = [
  {
    id: 1,
    description: 'Groceries',
    amount: 100,
    date: new Date('2023-12-17')
  },
  {
    id: 2,
    description: 'Gas',
    amount: 3000,
    date: new Date('2023-12-21')
  }
];

const mockNewTransaction: Transaction = {
  id: 3,
  description: 'New Transaction',
  amount: 100,
  date: new Date()
};

describe('App', () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    
    // Mock fetch for initial load
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url === '/api/v1/transactions') {
        return Promise.resolve({
          json: () => Promise.resolve(mockTransactions)
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('renders the app with title and add button', async () => {
    render(<App />);
    
    // Check if the title is displayed
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    
    // Check if add button is displayed
    expect(screen.getByRole('button', { name: /Add Transaction/i })).toBeInTheDocument();
    
    // Wait for transactions to load
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/transactions');
    });
  });

  it('displays transactions after loading', async () => {
    render(<App />);
    
    // Wait for transactions to load
    await waitFor(() => {
      // Check if transaction cards are displayed
      expect(screen.getByText(/Transaction 1/i)).toBeInTheDocument();
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      
      expect(screen.getByText(/Transaction 2/i)).toBeInTheDocument();
      expect(screen.getByText('Gas')).toBeInTheDocument();
      expect(screen.getByText('3000')).toBeInTheDocument();
    });
  });

  it('adds a new transaction when add button is clicked', async () => {
    // Mock fetch for adding a transaction
    global.fetch = vi.fn().mockImplementation((url, options) => {
      if (url === '/api/v1/transactions' && options?.method === 'POST') {
        return Promise.resolve({
          json: () => Promise.resolve(mockNewTransaction)
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve(mockTransactions)
      });
    });
    
    render(<App />);
    
    // Wait for initial transactions to load
    await waitFor(() => {
      expect(screen.getByText(/Transaction 1/i)).toBeInTheDocument();
    });
    
    // Click add button
    const addButton = screen.getByRole('button', { name: /Add Transaction/i });
    fireEvent.click(addButton);
    
    // Wait for new transaction to be added
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/transactions', expect.objectContaining({
        method: 'POST'
      }));
      
      // Check if new transaction is displayed
      expect(screen.getByText(/Transaction 3/i)).toBeInTheDocument();
      expect(screen.getAllByText('New Transaction')[0]).toBeInTheDocument();
    });
  });

  it('filters transactions when filter form is submitted', async () => {
    // Mock fetch for filtering transactions
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('startingDate') && url.includes('endingDate')) {
        return Promise.resolve({
          json: () => Promise.resolve([mockTransactions[0]])
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve(mockTransactions)
      });
    });
    
    render(<App />);
    
    // Wait for initial transactions to load
    await waitFor(() => {
      expect(screen.getByText(/Transaction 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Transaction 2/i)).toBeInTheDocument();
    });
    
    // Set start date
    const startDateInput = screen.getByLabelText(/Starting Date/i);
    fireEvent.change(startDateInput, { target: { value: '2023-12-01' } });
    
    // Set end date
    const endDateInput = screen.getByLabelText(/Ending Date/i);
    fireEvent.change(endDateInput, { target: { value: '2023-12-20' } });
    
    // Submit filter form
    const filterButton = screen.getByRole('button', { name: /Filter/i });
    fireEvent.click(filterButton);
    
    // Wait for filtered transactions to load
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('startingDate=2023-12-01'));
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('endingDate=2023-12-20'));
      
      // Check if only the first transaction is displayed
      expect(screen.getByText(/Transaction 1/i)).toBeInTheDocument();
      expect(screen.queryByText(/Transaction 2/i)).not.toBeInTheDocument();
    });
  });

  it('sorts transactions when sort option is changed', async () => {
    // Mock fetch for sorting transactions
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('sortBy=date')) {
        // Return transactions sorted by date (reversed order)
        return Promise.resolve({
          json: () => Promise.resolve([mockTransactions[1], mockTransactions[0]])
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve(mockTransactions)
      });
    });
    
    render(<App />);
    
    // Wait for initial transactions to load
    await waitFor(() => {
      expect(screen.getByText(/Transaction 1/i)).toBeInTheDocument();
    });
    
    // Change sort option to 'date'
    const sortSelect = screen.getByLabelText(/Sort Transactions/i);
    fireEvent.change(sortSelect, { target: { value: 'date' } });
    
    // Wait for sorted transactions to load
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('sortBy=date'));
    });
  });

  it('displays error message when fetch fails', async () => {
    // Mock fetch to fail
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    
    render(<App />);
    
    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Error fetching transactions/i)).toBeInTheDocument();
    });
  });
}); 