import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TransactionFilter from '../../TransactionFilter';

describe('TransactionFilter', () => {
  const mockProps = {
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    onStartDateChange: vi.fn(),
    onEndDateChange: vi.fn(),
    onFilter: vi.fn()
  };

  it('renders filter form correctly', () => {
    render(<TransactionFilter {...mockProps} />);
    
    // Check if the title is displayed - using heading role to be more specific
    expect(screen.getByRole('heading', { name: 'Filter' })).toBeInTheDocument();
    
    // Check if date inputs are displayed with correct labels
    expect(screen.getByLabelText(/Starting Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ending Date/i)).toBeInTheDocument();
    
    // Check if filter button is displayed
    expect(screen.getByRole('button', { name: /Filter/i })).toBeInTheDocument();
  });

  it('displays the correct date values', () => {
    render(<TransactionFilter {...mockProps} />);
    
    // Check if date inputs have the correct values
    const startDateInput = screen.getByLabelText(/Starting Date/i) as HTMLInputElement;
    const endDateInput = screen.getByLabelText(/Ending Date/i) as HTMLInputElement;
    
    expect(startDateInput.value).toBe('2023-01-01');
    expect(endDateInput.value).toBe('2023-01-31');
  });

  it('calls onStartDateChange when start date is changed', () => {
    render(<TransactionFilter {...mockProps} />);
    
    const startDateInput = screen.getByLabelText(/Starting Date/i);
    fireEvent.change(startDateInput, { target: { value: '2023-02-01' } });
    
    expect(mockProps.onStartDateChange).toHaveBeenCalled();
  });

  it('calls onEndDateChange when end date is changed', () => {
    render(<TransactionFilter {...mockProps} />);
    
    const endDateInput = screen.getByLabelText(/Ending Date/i);
    fireEvent.change(endDateInput, { target: { value: '2023-02-28' } });
    
    expect(mockProps.onEndDateChange).toHaveBeenCalled();
  });

  it('calls onFilter when form is submitted', () => {
    render(<TransactionFilter {...mockProps} />);
    
    const filterButton = screen.getByRole('button', { name: /Filter/i });
    fireEvent.click(filterButton);
    
    expect(mockProps.onFilter).toHaveBeenCalled();
  });
}); 