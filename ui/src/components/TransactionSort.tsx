import { Form, Row, Stack } from "react-bootstrap";

interface TransactionSortProps {
  sortBy: string;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TransactionSort = ({
  sortBy,
  onSortChange
}: TransactionSortProps) => {
  return (
    <Row className="mb-4">
      <Stack>
        <h3>Sort By</h3>
        <Stack
          direction="horizontal"
          gap={4}
          className="d-flex">
          <Stack direction="horizontal" gap={2}>
            <Form.Label htmlFor="sortBy" className="ms-auto">
              Sort Transactions
            </Form.Label>
            <Form.Select 
              id="sortBy" 
              value={sortBy} 
              onChange={onSortChange}
              style={{ width: '200px' }}
            >
              <option value="">None</option>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </Form.Select>
          </Stack>
        </Stack>
      </Stack>
    </Row>
  );
};

export default TransactionSort; 