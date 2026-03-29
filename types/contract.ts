export type ContractType = 'NAT_UK' | 'NAT_ES' | 'INT_UK_ES' | 'INT_ES_UK';
export type ContractLanguage = 'EN' | 'ES' | 'BILINGUAL';

export type ContractFormData = {
  // Step 1
  type: ContractType;
  language: ContractLanguage;

  // Step 2 — General
  client_name: string;
  client_phone: string;
  client_email: string;
  client_address: string;

  // Step 2 — Specific
  collection_address: string;
  destination_address: string;
  removal_date: string;
  price: string;
  items_description: string;
  annexe_file: File | null;

  // Step 3 — Extras
  includes_packaging: boolean;
  parking_within_25m: boolean;
  elevator_required: boolean;
  installation_required: boolean;
};

export const defaultFormData: ContractFormData = {
  type: 'NAT_UK',
  language: 'EN',
  client_name: '',
  client_phone: '',
  client_email: '',
  client_address: '',
  collection_address: '',
  destination_address: '',
  removal_date: '',
  price: '',
  items_description: '',
  annexe_file: null,
  includes_packaging: false,
  parking_within_25m: false,
  elevator_required: false,
  installation_required: false,
};