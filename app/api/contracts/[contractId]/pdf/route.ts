import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { renderContractHtml, ContractData } from '@/lib/renderTemplate';
import { generatePdf } from '@/lib/generatePdf';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function calcVat(price: number): string {
  return (price * 1.20).toFixed(2);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { contractId } = await params;

  const db = getDb();
  const contract = db.prepare('SELECT * FROM contracts WHERE id = ?').get(contractId) as any;

  if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const data: ContractData = {
    CONTRACT_REFERENCE: contract.reference,
    CLIENT_NAME: contract.client_name,
    CLIENT_EMAIL: contract.client_email,
    CLIENT_PHONE: contract.client_phone,
    CLIENT_ADDRESS: contract.client_address,
    COLLECTION_ADDRESS: contract.collection_address,
    DESTINATION_ADDRESS: contract.destination_address,
    REMOVAL_DATE: formatDate(contract.removal_date),
    PRICE: Number(contract.price).toFixed(2),
    PRICE_VAT: calcVat(Number(contract.price)),
    ANNEXE_CONTENT: contract.items_description ?? '',
    IF_PACKAGING_YES: contract.includes_packaging === 1,
    IF_PACKAGING_NO: contract.includes_packaging === 0,
    IF_PARKING_YES: contract.parking_within_25m === 1,
    IF_PARKING_NO: contract.parking_within_25m === 0,
    IF_ELEVATOR_YES: contract.elevator_required === 1,
    IF_ELEVATOR_NO: contract.elevator_required === 0,
    IF_INSTALLATION_YES: contract.installation_required === 1,
    IF_INSTALLATION_NO: contract.installation_required === 0,
  };

  try {
    const html = renderContractHtml(contract.type, data);
    const pdf = await generatePdf(html, contract.reference);

    return new NextResponse(pdf.buffer as ArrayBuffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${contract.reference}.pdf"`,
        },
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}