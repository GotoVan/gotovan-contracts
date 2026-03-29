import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: Promise<{ contractId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { contractId } = await params;

  const db = getDb();
  const contract = db.prepare('SELECT * FROM contracts WHERE id = ?').get(contractId);

  if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(contract);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { contractId } = await params;
  const formData = await req.formData();
  const get = (key: string) => formData.get(key)?.toString() ?? '';

  const db = getDb();

  db.prepare(`
    UPDATE contracts SET
      type = @type,
      language = @language,
      client_name = @client_name,
      client_email = @client_email,
      client_phone = @client_phone,
      client_address = @client_address,
      collection_address = @collection_address,
      destination_address = @destination_address,
      removal_date = @removal_date,
      price = @price,
      items_description = @items_description,
      includes_packaging = @includes_packaging,
      parking_within_25m = @parking_within_25m,
      elevator_required = @elevator_required,
      installation_required = @installation_required,
      status = 'draft',
      updated_at = datetime('now')
    WHERE id = @id
  `).run({
    id: contractId,
    type: get('type'),
    language: get('language'),
    client_name: get('client_name'),
    client_email: get('client_email'),
    client_phone: get('client_phone'),
    client_address: get('client_address'),
    collection_address: get('collection_address'),
    destination_address: get('destination_address'),
    removal_date: get('removal_date'),
    price: parseFloat(get('price')) || 0,
    items_description: get('items_description'),
    includes_packaging: get('includes_packaging') === 'true' ? 1 : 0,
    parking_within_25m: get('parking_within_25m') === 'true' ? 1 : 0,
    elevator_required: get('elevator_required') === 'true' ? 1 : 0,
    installation_required: get('installation_required') === 'true' ? 1 : 0,
  });

  return NextResponse.json({ id: contractId });
}