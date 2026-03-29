'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Footer from '@/app/components/Footer';

type Contract = {
  id: string;
  reference: string;
  type: 'NAT_UK' | 'NAT_ES' | 'INT_UK_ES' | 'INT_ES_UK';
  language: 'EN' | 'ES' | 'BILINGUAL';
  status: 'draft' | 'final';
  client_name: string;
  client_email: string;
  removal_date: string;
  price: number;
  created_at: string;
};

const TYPE_LABELS: Record<Contract['type'], string> = {
  NAT_UK: 'National UK',
  NAT_ES: 'National Spain',
  INT_UK_ES: 'International UK → ES',
  INT_ES_UK: 'International ES → UK',
};

const STATUS_COLOURS: Record<Contract['status'], string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  final: 'bg-green-100 text-green-800',
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contracts')
      .then(r => r.json())
      .then(data => {
        setContracts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="GotoVan" className="h-10 w-auto" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">GotoVan</h1>
            <p className="text-xs text-gray-400">Contract Generator</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Welcome, {session?.user?.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm text-red-500 hover:underline"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 flex-1 w-full">

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-blue-800 mb-2">How to generate a contract</h2>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Click <strong>New Contract</strong> below.</li>
            <li>Select the removal type and fill in all required fields.</li>
            <li>Review the generated contract and download, send, or save it.</li>
          </ol>
        </div>

        {/* Action */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Contracts</h2>
          <Link
            href="/contracts/new"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Contract
          </Link>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : contracts.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No contracts yet. Create your first one above.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Reference</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Client</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Price</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contracts.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{c.reference}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{c.client_name}</div>
                      <div className="text-xs text-gray-400">{c.client_email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{TYPE_LABELS[c.type]}</td>
                    <td className="px-4 py-3 text-gray-600">{c.removal_date}</td>
                    <td className="px-4 py-3 text-gray-600">£{c.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLOURS[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/contracts/${c.id}`} className="text-blue-500 hover:underline text-xs">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}