'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProfitRevenueChartProps {
  data: { 
    year: string; 
    revenue: number; 
    profit: number; 
  }[];
}

export function ProfitRevenueChart({ data }: ProfitRevenueChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip 
            formatter={(value: number, name: string) => 
              [`$${value.toLocaleString()}`, name === 'revenue' ? 'Revenue' : 'Profit']
            }
            labelFormatter={(label) => `Year: ${label}`}
          />
          <Legend />
          <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
          <Bar dataKey="profit" name="Profit" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
