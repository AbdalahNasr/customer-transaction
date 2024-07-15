import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const CustomerTransactions = () => {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await axios.get('https://abdalahnasr.github.io/json-api/db.json');
        const transactionsResponse = await axios.get('https://abdalahnasr.github.io/json-api/db.json');
        // const customersResponse = await axios.get('http://localhost:5000/customers');
        // const transactionsResponse = await axios.get('http://localhost:5000/transactions');
        // setCustomers(customersResponse.data);
        // setTransactions(transactionsResponse.data);
        setCustomers(customersResponse.data.customers);
        setTransactions(transactionsResponse.data.transactions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredTransactions = transactions.filter(
    (t) =>
      (!filter || customers.find((c) => c.id == t.customer_id)?.name.toLowerCase().includes(filter.toLowerCase()) ||
        t.amount.toString().includes(filter))
  );

  const customerTransactions = selectedCustomer
    ? transactions.filter((t) => t.customer_id == selectedCustomer.id)
    : [];

  const transactionData = customerTransactions.reduce((acc, transaction) => {
    const date = transaction.date;
    acc[date] = (acc[date] || 0) + transaction.amount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(transactionData),
    datasets: [
        {
            label: 'Transaction Amount',
            data: Object.values(transactionData),
            fill: false,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(75,192,192,1)'               }
    ]
  };
  console.log('transactionData:', transactionData);
  console.log('chartData:', chartData);
  return (
    <div className="p-6">
      <h1 className="text-2xl text-white font-bold mb-4 ">Customer Transactions</h1>
      <input
        type="text"
        placeholder="Filter by customer or amount"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 border border-gray-300 bg-black text-white rounded w-full"
      />
      <table className="min-w-full text-white bg-black ">
        <thead >
          <tr className='text-white bg-black'  >
            <th className="py-2 px-4 border-b">Customer Name</th>
            <th className="py-2 px-4 border-b">Transaction Date</th>
            <th className="py-2 px-4 border-b">Transaction Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => {
            const customer = customers.find((c) => c.id == transaction.customer_id);
            return (
              <tr
                key={transaction.id}
                onClick={() => setSelectedCustomer(customer)}
                className="hover:bg-gray-700 cursor-pointer bg-black "
              >
                <td className="py-2 px-4 border-b">{customer ? customer.name : 'Unknown Customer'}</td>
                <td className="py-2 px-4 border-b">{transaction.date}</td>
                <td className="py-2 px-4 border-b">{transaction.amount}</td>
              </tr>
            );
        })}
        </tbody>
      </table >
      {selectedCustomer && (
          <div className="mt-6 text-white  ">
          <h2 className="text-xl font-bold mb-4 ">{selectedCustomer.name}'s Transactions</h2>
          <Line className='bg-white'   data={chartData} />
        </div>
      )}
    </div>
  );
};

export default CustomerTransactions;
