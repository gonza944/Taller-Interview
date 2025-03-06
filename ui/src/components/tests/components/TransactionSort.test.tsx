import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TransactionSort from '../../TransactionSort';

describe('TransactionSort', () => {
  const mockProps = {
    sortBy: '',
    onSortChange: vi.fn()
  };

  beforeEach(() => {
    // Reset the mock before each test
    vi.clearAllMocks();
  });

  it('renders sort form correctly', () => {
    render(<TransactionSort {...mockProps} />);
    
    // Check if the title is displayed
    expect(screen.getByText('Sort By')).toBeInTheDocument();
    
    // Check if sort select is displayed with correct label
    expect(screen.getByLabelText(/Sort Transactions/i)).toBeInTheDocument();
    
    // Check if all options are displayed
    const selectElement = screen.getByLabelText(/Sort Transactions/i);
    expect(selectElement).toBeInTheDocument();
    
    // Check options
    expect(screen.getByRole('option', { name: 'None' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Date' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Amount' })).toBeInTheDocument();
  });

  it('displays the correct selected option', () => {
    // Test with default value (empty string)
    const { unmount } = render(<TransactionSort {...mockProps} />);
    
    const selectElement = screen.getByLabelText(/Sort Transactions/i) as HTMLSelectElement;
    expect(selectElement.value).toBe('');
    
    // Clean up and render with 'date' value
    unmount();
    render(<TransactionSort sortBy="date" onSortChange={mockProps.onSortChange} />);
    
    const dateSelectElement = screen.getByLabelText(/Sort Transactions/i) as HTMLSelectElement;
    expect(dateSelectElement.value).toBe('date');
  });

  it('calls onSortChange when selection changes', () => {
    render(<TransactionSort {...mockProps} />);
    
    const selectElement = screen.getByLabelText(/Sort Transactions/i);
    fireEvent.change(selectElement, { target: { value: 'date' } });
    
    expect(mockProps.onSortChange).toHaveBeenCalled();
  });

  it('handles different sort options correctly', () => {
    // Create a fresh mock for this test
    const freshMock = vi.fn();
    render(<TransactionSort sortBy="" onSortChange={freshMock} />);
    
    const selectElement = screen.getByLabelText(/Sort Transactions/i);
    
    // Test changing to 'date'
    fireEvent.change(selectElement, { target: { value: 'date' } });
    expect(freshMock).toHaveBeenCalledTimes(1);
    
    // Test changing to 'amount'
    fireEvent.change(selectElement, { target: { value: 'amount' } });
    expect(freshMock).toHaveBeenCalledTimes(2);
    
    // Test changing back to 'none'
    fireEvent.change(selectElement, { target: { value: '' } });
    expect(freshMock).toHaveBeenCalledTimes(3);
  });
}); 