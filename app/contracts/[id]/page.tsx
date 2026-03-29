'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/app/components/Footer';

type Contract = {
  id: string;
  reference: string;
  type: string;
  language: string;
  status: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  collection_address: string;
  destination_address: string;
  removal_date: string;
  price: number;
  items_description: string;
  annexe_filename: string | null;
  includes_packaging: number;
  parking_within_25m: number;
  elevator_required: number;
  installation_required: number;
  created_at: string;
};

const TYPE_LABELS: Record<string, string> = {
  NAT_UK: 'National UK',
  NAT_ES: 'National Spain',
  INT_UK_ES: 'International UK → Spain',
  INT_ES_UK: 'International Spain → UK',
};

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex py-2 border-b border-gray-100 last:border-0">
      <span className="w-48 text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value}</span>
    </div>
  );
}

function Badge({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2 ${
      active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400 line-through'
    }`}>
      {label}
    </span>
  );
}

export default function ContractReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    fetch(`/api/contracts/${id}`)
      .then(r => r.json())
      .then(data => {
        setContract(data);
        setLoading(false);
      });
  }, [id]);

  async function handleDownloadPdf() {
    const res = await fetch(`/api/contracts/${id}/pdf`);
    if (!res.ok) return alert('PDF generation failed.');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contract?.reference ?? id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSendEmail() {
    setEmailSending(true);
    const res = await fetch(`/api/contracts/${id}/send-email`, { method: 'POST' });
    setEmailSending(false);
    if (res.ok) {
      setEmailSent(true);
    } else {
      alert('Failed to send email. Please check your mail configuration.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading contract...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-400 text-sm">Contract not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="GotoVan" className="h-10 w-auto" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">GotoVan</h1>
            <p className="text-xs text-gray-400">Contract Generator</p>
          </div>
        </div>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:underline">
          ← Back to dashboard
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6 flex-1 w-full">

        {/* Header card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Contract reference</p>
              <h2 className="text-2xl font-bold text-gray-800 font-mono">{contract.reference}</h2>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              contract.status === 'final' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {contract.status}
            </span>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>{TYPE_LABELS[contract.type] ?? contract.type}</span>
            <span>·</span>
            <span>{contract.language}</span>
            <span>·</span>
            <span>Created {new Date(contract.created_at).toLocaleDateString('en-GB')}</span>
          </div>
        </div>

        {/* Client information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Client</h3>
          <Row label="Name" value={contract.client_name} />
          <Row label="Email" value={contract.client_email} />
          <Row label="Phone" value={contract.client_phone} />
          <Row label="Billing address" value={contract.client_address} />
        </div>

        {/* Removal details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Removal details</h3>
          <Row label="Collection address" value={contract.collection_address} />
          <Row label="Destination address" value={contract.destination_address} />
          <Row label="Removal date" value={new Date(contract.removal_date).toLocaleDateString('en-GB')} />
          <Row label="Price" value={`£${contract.price != null ? Number(contract.price).toLocaleString() : '—'}`} />
          {contract.items_description && (
            <Row label="Items" value={contract.items_description} />
          )}
          {contract.annexe_filename && (
            <Row label="Annexe file" value={contract.annexe_filename} />
          )}
        </div>

        {/* Extra services */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional services</h3>
          <Badge active={!!contract.includes_packaging} label="Packaging service" />
          <Badge active={!!contract.parking_within_25m} label="Parking within 25m" />
          <Badge active={!!contract.elevator_required} label="Elevator available" />
          <Badge active={!!contract.installation_required} label="Installation & unpacking" />
        </div>

        {/* Action buttons */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              ↓ Download PDF
            </button>
            <button
              onClick={handleSendEmail}
              disabled={emailSending || emailSent}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {emailSent ? '✓ Email sent' : emailSending ? 'Sending...' : '✉ Send by email'}
            </button>
            <Link
              href={`/contracts/${id}/edit`}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              ✎ Edit
            </Link>
            <Link
              href="/contracts/new"
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              + New contract
            </Link>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}