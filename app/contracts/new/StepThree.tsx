'use client';

import { ContractFormData } from '@/types/contract';

type Props = {
  data: ContractFormData;
  onChange: (updates: Partial<ContractFormData>) => void;
};

function Toggle({
  label, description, checked, onChange
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full text-left p-4 rounded-xl border-2 transition ${
        checked ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-800">{label}</div>
          <div className="text-xs text-gray-500 mt-0.5">{description}</div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${
          checked ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
        }`}>
          {checked && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>
    </button>
  );
}

export default function StepThree({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-800 mb-2">Additional services</h2>
      <p className="text-sm text-gray-500 mb-4">Select all that apply to this removal.</p>

      <Toggle
        label="Packaging service included"
        description="GotoVan will pack the client's belongings prior to the removal."
        checked={data.includes_packaging}
        onChange={v => onChange({ includes_packaging: v })}
      />
      <Toggle
        label="Parking within 25 metres"
        description="The property allows parking within 25m of the entrance."
        checked={data.parking_within_25m}
        onChange={v => onChange({ parking_within_25m: v })}
      />
      <Toggle
        label="Elevator available"
        description="An elevator is available at the property."
        checked={data.elevator_required}
        onChange={v => onChange({ elevator_required: v })}
      />
      <Toggle
        label="Installation and unpacking required"
        description="GotoVan is required to install and unpack items at the destination."
        checked={data.installation_required}
        onChange={v => onChange({ installation_required: v })}
      />
    </div>
  );
}