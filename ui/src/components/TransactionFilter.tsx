import { FormEvent } from "react";
import { Button, Form, Row, Stack } from "react-bootstrap";

interface TransactionFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilter: (e: FormEvent) => void;
}

const TransactionFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onFilter
}: TransactionFilterProps) => {
  return (
    <Row className="mb-4">
      <Stack>
        <h3>Filter</h3>
        <Form onSubmit={onFilter}>
          <Stack
            direction="horizontal"
            gap={4}
            className="d-flex justify-content-center">
            <Stack direction="horizontal" gap={2}>
              <Form.Label htmlFor="startingDate" className="ms-auto">
                Starting Date
              </Form.Label>
              <Form.Control 
                type="date" 
                id="startingDate" 
                value={startDate}
                onChange={onStartDateChange}
              />
            </Stack>
            <Stack direction="horizontal" gap={2}>
              <Form.Label htmlFor="endDate" className="ms-auto">
                Ending Date
              </Form.Label>
              <Form.Control 
                type="date" 
                id="endDate" 
                value={endDate}
                onChange={onEndDateChange}
              />
            </Stack>
            <Stack direction="horizontal" gap={2}>
              <Button variant="primary" type="submit">
                Filter
              </Button>
            </Stack>
          </Stack>
        </Form>
      </Stack>
    </Row>
  );
};

export default TransactionFilter; 