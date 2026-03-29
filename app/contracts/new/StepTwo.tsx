'use client';

import { ContractFormData } from '@/types/contract';

type Props = {
  data: ContractFormData;
  onChange: (updates: Partial<ContractFormData>) => void;
};

function Field({
  label, name, type = 'text', value, onChange, required = true, placeholder
}: {
  label: string;
  name: keyof ContractFormData;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default function StepTwo({ data, onChange }: Props) {
  return (
    <div className="space-y-8">

      {/* General Information */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-4">Client information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name" name="client_name" value={data.client_name} onChange={v => onChange({ client_name: v })} />
          <Field label="Phone number" name="client_phone" value={data.client_phone} onChange={v => onChange({ client_phone: v })} />
          <Field label="Email address" name="client_email" type="email" value={data.client_email} onChange={v => onChange({ client_email: v })} />
          <Field label="Billing address" name="client_address" value={data.client_address} onChange={v => onChange({ client_address: v })} />
        </div>
      </div>

      {/* Specific Information */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-4">Removal details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Collection address" name="collection_address" value={data.collection_address} onChange={v => onChange({ collection_address: v })} />
          <Field label="Destination address" name="destination_address" value={data.destination_address} onChange={v => onChange({ destination_address: v })} />
          <Field label="Removal date" name="removal_date" type="date" value={data.removal_date} onChange={v => onChange({ removal_date: v })} />
          <Field label="Price (£ or €)" name="price" type="number" value={data.price} onChange={v => onChange({ price: v })} placeholder="e.g. 1200" />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Items to be transported
          </label>
          <textarea
            value={data.items_description}
            onChange={e => onChange({ items_description: e.target.value })}
            rows={4}
            placeholder="List the items to be transported, or leave blank if uploading a file below."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload items list (Word or PDF) — optional
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={e => onChange({ annexe_file: e.target.files?.[0] ?? null })}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {data.annexe_file && (
            <p className="text-xs text-green-600 mt-1">✓ {data.annexe_file.name}</p>
          )}
        </div>
      </div>
    </div>
  );
}