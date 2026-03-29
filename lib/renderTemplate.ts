import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export type ContractData = {
  CONTRACT_REFERENCE: string;
  CLIENT_NAME: string;
  CLIENT_EMAIL: string;
  CLIENT_PHONE: string;
  CLIENT_ADDRESS: string;
  COLLECTION_ADDRESS: string;
  DESTINATION_ADDRESS: string;
  REMOVAL_DATE: string;
  PRICE: string;
  PRICE_VAT: string;
  ANNEXE_CONTENT: string;
  IF_PACKAGING_YES: boolean;
  IF_PACKAGING_NO: boolean;
  IF_PARKING_YES: boolean;
  IF_PARKING_NO: boolean;
  IF_ELEVATOR_YES: boolean;
  IF_ELEVATOR_NO: boolean;
  IF_INSTALLATION_YES: boolean;
  IF_INSTALLATION_NO: boolean;
};

const TEMPLATE_MAP: Record<string, string> = {
  NAT_ES: 'nat-es.html',
  NAT_UK: 'nat-uk.html',
  INT_UK_ES: 'int-uk-es.html',
  INT_ES_UK: 'int-es-uk.html',
};

export function renderContractHtml(
  contractType: string,
  data: ContractData
): string {
  const templateFile = TEMPLATE_MAP[contractType];
  if (!templateFile) throw new Error(`Unknown contract type: ${contractType}`);

  const templatePath = path.join(process.cwd(), 'templates', templateFile);
  const raw = fs.readFileSync(templatePath, 'utf-8');

  // Convert {{PLACEHOLDER}} syntax to Handlebars {{PLACEHOLDER}}
  // Templates already use {{}} so Handlebars works directly
  const template = Handlebars.compile(raw, { noEscape: true });
  return template(data);
}