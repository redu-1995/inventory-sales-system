import React, { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';

const ReceivePaymentModal = ({ isOpen, onClose, sale, onSubmit }) => {
  const [receiveAmount, setReceiveAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setReceiveAmount('');
    setPaymentMethod('Cash');
  }, [sale, isOpen]);

  if (!isOpen || !sale) return null;

  const totalAmount = parseFloat(sale.total_amount) || 0;
  const alreadyPaid = parseFloat(sale.paid_amount || sale.amount_paid) || (sale.status === 'PAID' ? totalAmount : 0);
  const remaining = Math.max(0, totalAmount - alreadyPaid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(receiveAmount);

    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (amountNum > remaining) {
      alert(`Amount cannot exceed the remaining balance of ${remaining.toLocaleString()} ETB.`);
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedPaidAmount = alreadyPaid + amountNum;
      
      // Determine new status automatically
      const newStatus = updatedPaidAmount >= totalAmount ? 'PAID' : 'PARTIAL';

      await onSubmit({
        saleId: sale.id,
        amount: amountNum,
        paidAmount: updatedPaidAmount,
        paymentMethod,
        status: newStatus
      });

      onClose();
    } catch (err) {
      console.error('Failed to submit payment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Receive Payment</h3>
              <p className="text-xs text-gray-500">Invoice #{sale.id || sale.invoice_number}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Payment Summary */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
            <div>
              <span className="block text-xs text-gray-500">Total</span>
              <span className="text-sm font-semibold text-gray-900">{totalAmount.toLocaleString()} ETB</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500">Already Paid</span>
              <span className="text-sm font-semibold text-emerald-600">{alreadyPaid.toLocaleString()} ETB</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500">Remaining</span>
              <span className="text-sm font-semibold text-rose-600">{remaining.toLocaleString()} ETB</span>
            </div>
          </div>

          {/* Input Amount */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Receive Amount (ETB)
            </label>
            <input
              type="number"
              step="0.01"
              max={remaining}
              placeholder={`Max ${remaining.toLocaleString()} ETB`}
              value={receiveAmount}
              onChange={(e) => setReceiveAmount(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
            >
              <option value="Cash">Cash</option>
              <option value="Telebirr">Telebirr</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceivePaymentModal;