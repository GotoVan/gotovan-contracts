'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ContractFormData, defaultFormData } from '@/types/contract';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import Footer from '@/app/components/Footer';

const STEPS = ['Contract Type', 'Job Details', 'Extra Services'];

export default function NewContractPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ContractFormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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

    const res = await fetch('/api/contracts', {
      method: 'POST',
      body,
    });

    if (!res.ok) {
      setError('Failed to save contract. Please try again.');
      setSubmitting(false);
      return;
    }

    const contract = await res.json();
    router.push(`/contracts/${contract.id}`);
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
              {submitting ? 'Generating...' : 'Generate Contract →'}
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}