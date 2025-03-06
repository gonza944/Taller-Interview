import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, FormEvent } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import "./App.css";
import TransactionCard from "./components/TransactionCard";
import TransactionFilter from "./components/TransactionFilter";
import TransactionSort from "./components/TransactionSort";
import { Transaction } from "./types";

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Define the interface for the parameters
  interface FetchTransactionsParams {
    startingDate?: string;
    endingDate?: string;
    sortBy?: string;
  }

  const fetchTransactions = async (params?: FetchTransactionsParams) => {
    try {
      let url = "/api/v1/transactions";

      // Add query parameters
      const urlParams = new URLSearchParams();

      if (params?.startingDate && params?.endingDate) {
        urlParams.append("startingDate", params.startingDate);
        urlParams.append("endingDate", params.endingDate);
      }
      if (params?.sortBy) {
        urlParams.append("sortBy", params.sortBy);
      }

      // Append params to URL if any exist
      if (urlParams.toString()) {
        url += `?${urlParams.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setTransactions(data);
      setError(null);
    } catch (e) {
      setError(
        `Error fetching transactions: ${
          e instanceof Error ? e.message : "Unknown error"
        }`
      );
    }
  };

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();

    if (startDate && endDate) {
      fetchTransactions({
        startingDate: startDate,
        endingDate: endDate,
        sortBy,
      });
    } else {
      setError("Please select both start and end dates");
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value;

    // Create params object with dates only if both are provided
    const params: FetchTransactionsParams = { sortBy: newSortBy };
    if (startDate && endDate) {
      params.startingDate = startDate;
      params.endingDate = endDate;
    }

    // Fetch with new parameters
    fetchTransactions(params);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const addTransaction = async () => {
    try {
      const response = await fetch("/api/v1/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: "New Transaction",
          amount: 100,
          date: new Date(),
        }),
      });

      const newTransaction = await response.json();
      setTransactions([...transactions, newTransaction]);
      setError(null);
    } catch (e) {
      setError(
        `Error adding transaction: ${
          e instanceof Error ? e.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <Container fluid className="App">
      <Row>{error && <Alert variant="danger">{error}</Alert>}</Row>
      <Row>
        <h1>Transactions</h1>
      </Row>
      <Row className="d-flex justify-content-center mb-4">
        <Button onClick={addTransaction} className="mb-4 Button">
          Add Transaction
        </Button>
      </Row>

      <TransactionFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onFilter={handleFilter}
      />

      <TransactionSort sortBy={sortBy} onSortChange={handleSortChange} />

      <Row>
        {transactions.map((transaction) => (
          <Col key={transaction.id} md={4} className="mb-3">
            <TransactionCard transaction={transaction} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default App;
