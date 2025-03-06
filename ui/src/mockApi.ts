import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import { DB, Transaction } from "./types";
import { CreateTransactionDTO } from "./types";

const isNetworkDown = () => 0.3 < Math.random();
const networkErrorResponse = new HttpResponse(null, { status: 500 });

const db: DB = {
  transactions: [
    {
      id: 1,
      description: "Groceries",
      amount: 100,
      date: new Date("December 17, 2023 03:24:00"),
    },
    {
      id: 2,
      description: "Gas",
      amount: 3000,
      date: new Date("December 21, 2023 03:24:00"),
    },
    {
      id: 3,
      description: "Restaurant",
      amount: 500,
      date: new Date("December 1, 2024 03:24:00"),
    },
  ],
  _idCounter: 3,
};

const handlers = [
  http.get("/api/v1/transactions", ({ request }) => {
    if (isNetworkDown()) return networkErrorResponse;

    // Get URL to extract query parameters
    const url = new URL(request.url);
    const startingDateParam = url.searchParams.get("startingDate");
    const endingDateParam = url.searchParams.get("endingDate");
    const sortBy = url.searchParams.get("sortBy"); // 'date' or 'amount'

    let filteredTransactions = [...db.transactions];

    if (startingDateParam && endingDateParam) {
      const startDate = new Date(startingDateParam);
      const endDate = new Date(endingDateParam);

      filteredTransactions = filteredTransactions.filter(
        (transaction) =>
          new Date(transaction.date) >= startDate &&
          new Date(transaction.date) <= endDate
      );
    }

    // Sort transactions if sortBy parameter is provided
    if (sortBy === "date") {
      filteredTransactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (sortBy === "amount") {
      filteredTransactions.sort((a, b) => b.amount - a.amount);
    }

    return HttpResponse.json<Transaction[]>(filteredTransactions);
  }),

  http.post("/api/v1/transactions", async ({ request }) => {
    if (isNetworkDown()) return networkErrorResponse;

    const newTransaction = (await request.json()) as CreateTransactionDTO;

    const transaction: Transaction = {
      id: ++db._idCounter,
      ...newTransaction,
    };

    db.transactions.push(transaction);

    return HttpResponse.json<Transaction>(transaction, { status: 201 });
  }),
];

const worker = setupWorker(...handlers);

export const bootMockApi = async () => {
  try {
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    });
    console.log("Mock Service Worker started successfully");
  } catch (error) {
    console.error("Failed to start Mock Service Worker:", error);
  }
};
