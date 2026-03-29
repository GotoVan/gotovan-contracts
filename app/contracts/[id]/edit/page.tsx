'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ContractFormData, defaultFormData } from '@/types/contract';
import StepOne from '@/app/contracts/new/StepOne';
import StepTwo from '@/app/contracts/new/StepTwo';
import StepThree from '@/app/contracts/new/StepThree';
import Footer from '@/app/components/Footer';

const STEPS = ['Contract Type', 'Job Details', 'Extra Services'];

export default function EditContractPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ContractFormData>(defaultFormData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/contracts/${id}`)
      .then(r => r.json())
      .then((contract: any) => {
        setData({
          type: contract.type,
          language: contract.language,
          client_name: contract.client_name ?? '',
          client_phone: contract.client_phone ?? '',
          client_email: contract.client_email ?? '',
          client_address: contract.client_address ?? '',
          collection_address: contract.collection_address ?? '',
          destination_address: contract.destination_address ?? '',
          removal_date: contract.removal_date ?? '',
          price: String(contract.price ?? ''),
          items_description: contract.items_description ?? '',
          annexe_file: null,
          includes_packaging: contract.includes_packaging === 1,
          parking_within_25m: contract.parking_within_25m === 1,
          elevator_required: contract.elevator_required === 1,
          installation_required: contract.installation_required === 1,
        });
        setLoading(false);
      });
  }, [id]);

  function update(updates: Partial<ContractFormData>) {
    setData((prev: ContractFormData) => ({ ...prev, ...updates }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');

    const body = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'annexe_file') return;
      body.append(key, String(value));
    });
    if (data.annexe_file) body.append('annexe_file', data.annexe_file);

    const res = await fetch(`/api/contracts/${id}`, {
      method: 'PATCH',
      body,
    });

    if (!res.ok) {
      setError('Failed to save changes. Please try again.');
      setSubmitting(false);
      return;
    }

    router.push(`/contracts/${id}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading contract...</p>
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

      <div className="max-w-2xl mx-auto px-6 py-8 flex-1 w-full">

        {/* Progress */}
        <div className="flex items-center mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  i < step ? 'bg-blue-600 text-white' :
                  i === step ? 'bg-blue-600 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-medium ${i === step ? 'text-gray-800' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-400">
              Editing contract — changes will reset status to <span className="font-medium text-yellow-600">draft</span>
            </p>
          </div>
          {step === 0 && <StepOne data={data} onChange={update} />}
          {step === 1 && <StepTwo data={data} onChange={update} />}
          {step === 2 && <StepThree data={data} onChange={update} />}
        </div>

        {/* Navigation */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition"
          >
            ← Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
            >
              {submitting ? 'Saving...' : 'Save changes →'}
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}