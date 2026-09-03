import React from 'react'
import Link from 'next/link'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  collection: string
  columns: Column[]
  data: any[]
}

export default function DataTable({ collection, columns, data }: DataTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/80 border-b border-zinc-800/80">
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-sm font-medium text-zinc-400">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-4 text-sm font-medium text-zinc-400 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-zinc-500">
                  No se encontraron registros.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr 
                  key={row.id || i} 
                  className="hover:bg-zinc-800/30 transition-colors group"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-zinc-300">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/${collection}/${row.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors border border-zinc-700 hover:border-zinc-500"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
