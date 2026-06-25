import React from 'react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import Badge from './components/ui/Badge';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-6">
        
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Design System</h1>
          <p className="text-slate-500 mt-1">Verifying design component tokens.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500">Stock Status</span>
              <Badge variant="success">In Stock</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">1,248 Items</p>
          </Card>
          
          <Card>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500">Alert Status</span>
              <Badge variant="danger">Out of Stock</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">7 Products</p>
          </Card>

          <Card>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500">Reorder Status</span>
              <Badge variant="warning">Critical</Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">23 Products</p>
          </Card>
        </div>

        <Card className="max-w-md mx-auto">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Sample Input Form</h3>
          <Input id="prod-name" label="Product Name" placeholder="e.g., Wireless Mouse" />
          <Input id="prod-sku" label="SKU Code" value="INVALID-SKU" error="This field must match format XX-XXXX-XXX" readOnly />
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary">Save Product</Button>
          </div>
        </Card>

      </div>
    </div>
  );
}

export default App;