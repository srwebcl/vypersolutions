import React from 'react'

interface StatWidgetProps {
  title: string
  value: string | number
  icon: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export default function StatWidget({ title, value, icon, trend }: StatWidgetProps) {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className="text-6xl">{icon}</span>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-xl border border-blue-500/20">
            {icon}
          </div>
          <h3 className="text-zinc-400 font-medium">{title}</h3>
        </div>
        
        <div className="flex items-end gap-4">
          <p className="text-4xl font-bold text-zinc-100 tracking-tight">{value}</p>
          
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
