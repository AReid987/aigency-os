import React, { useState, useMemo } from 'react';
import type { Card } from '@aigency-os/shared-types';
import { DollarSign } from 'lucide-react';

interface RevenueCardProps {
  card: Card;
  editable: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
}

export const RevenueCard = React.memo(function RevenueCard({ card, editable, onUpdate }: RevenueCardProps) {
  const content = card.content as Record<string, string>;
  const [model, setModel] = useState(content.model || 'subscription');
  const [price, setPrice] = useState(Number(content.price) || 10);
  const [customers, setCustomers] = useState(Number(content.customers) || 100);
  const [churn, setChurn] = useState(Number(content.churn) || 5);
  const [cac, setCac] = useState(Number(content.cac) || 50);

  const metrics = useMemo(() => {
    const mrr = price * customers;
    const arr = mrr * 12;
    const ltv = price / (churn / 100);
    const ltvCacRatio = ltv / cac;
    const paybackMonths = cac / price;
    return { mrr, arr, ltv, ltvCacRatio, paybackMonths };
  }, [price, customers, churn, cac]);

  const handleChange = (field: string, value: number | string) => {
    const updates: Record<string, unknown> = { [field]: value, model };
    if (field === 'price') setPrice(value as number);
    if (field === 'customers') setCustomers(value as number);
    if (field === 'churn') setChurn(value as number);
    if (field === 'cac') setCac(value as number);
    if (field === 'model') setModel(value as string);
    onUpdate(updates);
  };

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-1.5">
        <DollarSign size={14} className="text-success" />
        <span className="text-xs font-semibold text-fg">
          {content.title || 'Revenue Calculator'}
        </span>
      </div>

      {/* Model selector */}
      <div className="flex gap-1">
        {['subscription', 'usage', 'one-time'].map((m) => (
          <button
            key={m}
            onClick={() => handleChange('model', m)}
            className={`px-2 py-0.5 text-[10px] rounded-sm transition-colors ${
              model === m ? 'bg-primary-muted text-primary font-medium' : 'text-fg-muted hover:bg-hover'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <label className="space-y-0.5">
          <span className="text-fg-muted">Price ($/mo)</span>
          <input
            type="number"
            value={price}
            onChange={(e) => handleChange('price', Number(e.target.value))}
            className="w-full px-1.5 py-1 bg-hover/60 border border-border rounded text-fg text-[10px] focus:outline-none focus:border-primary"
            disabled={!editable}
          />
        </label>
        <label className="space-y-0.5">
          <span className="text-fg-muted">Customers</span>
          <input
            type="number"
            value={customers}
            onChange={(e) => handleChange('customers', Number(e.target.value))}
            className="w-full px-1.5 py-1 bg-hover/60 border border-border rounded text-fg text-[10px] focus:outline-none focus:border-primary"
            disabled={!editable}
          />
        </label>
        <label className="space-y-0.5">
          <span className="text-fg-muted">Churn (%)</span>
          <input
            type="number"
            value={churn}
            onChange={(e) => handleChange('churn', Number(e.target.value))}
            className="w-full px-1.5 py-1 bg-hover/60 border border-border rounded text-fg text-[10px] focus:outline-none focus:border-primary"
            disabled={!editable}
          />
        </label>
        <label className="space-y-0.5">
          <span className="text-fg-muted">CAC ($)</span>
          <input
            type="number"
            value={cac}
            onChange={(e) => handleChange('cac', Number(e.target.value))}
            className="w-full px-1.5 py-1 bg-hover/60 border border-border rounded text-fg text-[10px] focus:outline-none focus:border-primary"
            disabled={!editable}
          />
        </label>
      </div>

      {/* Metrics */}
      <div className="space-y-1.5 pt-1 border-t border-border">
        <div className="flex justify-between text-[10px]">
          <span className="text-fg-muted">MRR</span>
          <span className="font-mono font-semibold text-success">${metrics.mrr.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-fg-muted">ARR</span>
          <span className="font-mono font-semibold text-success">${metrics.arr.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-fg-muted">LTV</span>
          <span className="font-mono text-primary">${metrics.ltv.toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-fg-muted">LTV/CAC</span>
          <span className={`font-mono font-semibold ${metrics.ltvCacRatio >= 3 ? 'text-success' : metrics.ltvCacRatio >= 1 ? 'text-warning' : 'text-error'}`}>
            {metrics.ltvCacRatio.toFixed(1)}x
          </span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-fg-muted">Payback</span>
          <span className="font-mono text-fg-secondary">{metrics.paybackMonths.toFixed(1)} mo</span>
        </div>
      </div>
    </div>
  );
});
