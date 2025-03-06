export interface CreateTransactionDTO {
  description: string;
  amount: number;
  date: Date;
}

export interface Transaction extends CreateTransactionDTO {
  id: number;
}

export interface DB {
  transactions: Transaction[];
  _idCounter: number;
} 