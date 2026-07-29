import React from 'react';
import CustomerRow from './CustomerRow';

export default function CustomerTable({
  customers,
  loading,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <th className="p-4 w-10">
              <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            </th>
            <th className="p-4">Customer</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Email</th>
            <th className="p-4">Total Purchases</th>
            <th className="p-4">Outstanding Balance</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
          {!loading && customers.map((customer) => (
            <CustomerRow
              key={customer.id}
              customer={customer}
              onView={onViewCustomer}
              onEdit={onEditCustomer}
              onDelete={onDeleteCustomer}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}