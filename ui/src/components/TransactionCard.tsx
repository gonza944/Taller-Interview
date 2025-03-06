import { Card } from "react-bootstrap";
import { Transaction } from "../types";


interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Transaction {transaction.id}</Card.Title>
        <Card.Text>{transaction.description}</Card.Text>
        <Card.Text>{transaction.amount}</Card.Text>
        <Card.Text>
          {new Date(transaction.date).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          })}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default TransactionCard; 