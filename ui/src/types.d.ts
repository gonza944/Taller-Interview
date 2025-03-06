interface CreateTransactionDTO {
  description: string
  amount: number
  date: Date
}

interface Transaction extends CreateTransactionDTO {
  id: number
}

interface DB {
  transactions: Transaction[];
  _idCounter: number;
}


