'use client';

import { ContractFormData, ContractType, ContractLanguage } from '@/types/contract';

type Props = {
  data: ContractFormData;
  onChange: (updates: Partial<ContractFormData>) => void;
};

const CONTRACT_TYPES: { value: ContractType; label: string; description: string }[] = [
  { value: 'NAT_UK', label: 'National UK', description: 'Collection and delivery within the United Kingdom' },
  { value: 'NAT_ES', label: 'National Spain', description: 'Recogida y entrega dentro de España' },
  { value: 'INT_UK_ES', label: 'International UK → Spain', description: 'Collection in the UK, delivery in Spain' },
  { value: 'INT_ES_UK', label: 'International Spain → UK', description: 'Recogida en España, entrega en el Reino Unido' },
];

const LANGUAGE_OPTIONS: { value: ContractLanguage; label: string; available: ContractType[] }[] = [
  { value: 'EN', label: 'English only', available: ['NAT_UK', 'INT_UK_ES', 'INT_ES_UK'] },
  { value: 'ES', label: 'Español only', available: ['NAT_ES', 'INT_UK_ES', 'INT_ES_UK'] },
  { value: 'BILINGUAL', label: 'Bilingual (EN + ES)', available: ['INT_UK_ES', 'INT_ES_UK'] },
];

export default function StepOne({ data, onChange }: Props) {
  const availableLanguages = LANGUAGE_OPTIONS.filter(l => l.available.includes(data.type));

  function handleTypeChange(type: ContractType) {
    // Reset language to a valid option for the new type
    const validLanguages = LANGUAGE_OPTIONS.filter(l => l.available.includes(type));
    onChange({ type, language: validLanguages[0].value });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-1">Contract type</h2>
        <p className="text-sm text-gray-500 mb-3">Select the type of removal this contract covers.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONTRACT_TYPES.map(ct => (
            <button
              key={ct.value}
              type="button"
              onClick={() => handleTypeChange(ct.value)}
              className={`text-left p-4 rounded-xl border-2 transition ${
                data.type === ct.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm text-gray-800">{ct.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{ct.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-1">Contract language</h2>
        <p className="text-sm text-gray-500 mb-3">Choose the language for the generated document.</p>
        <div className="flex flex-wrap gap-3">
          {availableLanguages.map(l => (
            <button
              key={l.value}
              type="button"
              onClick={() => onChange({ language: l.value })}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${
                data.language === l.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}