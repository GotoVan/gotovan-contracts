import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

function generateReference(type: string): string {
  const prefix: Record<string, string> = {
    NAT_UK: 'UK',
    NAT_ES: 'ES',
    INT_UK_ES: 'UE',
    INT_ES_UK: 'EU',
  };
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `GV-${year}-${prefix[type] ?? 'XX'}-${rand}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const db = getDb();
  const contracts = db.prepare(`
    SELECT id, reference, type, language, status, client_name, client_email, removal_date, price, created_at
    FROM contracts
    ORDER BY created_at DESC
  `).all();

  return NextResponse.json(contracts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const formData = await req.formData();
  const get = (key: string) => formData.get(key)?.toString() ?? '';

  const id = uuidv4();
  const reference = generateReference(get('type'));

  const db = getDb();
  db.prepare(`
    INSERT INTO contracts (
      id, reference, type, language, status,
      client_name, client_email, client_phone, client_address,
      collection_address, destination_address, removal_date, price,
      items_description, annexe_filename,
      includes_packaging, parking_within_25m, elevator_required, installation_required,
      created_by
    ) VALUES (
      @id, @reference, @type, @language, 'draft',
      @client_name, @client_email, @client_phone, @client_address,
      @collection_address, @destination_address, @removal_date, @price,
      @items_description, @annexe_filename,
      @includes_packaging, @parking_within_25m, @elevator_required, @installation_required,
      @created_by
    )
  `).run({
    id,
    reference,
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
    annexe_filename: (formData.get('annexe_file') as File)?.name ?? null,
    includes_packaging: get('includes_packaging') === 'true' ? 1 : 0,
    parking_within_25m: get('parking_within_25m') === 'true' ? 1 : 0,
    elevator_required: get('elevator_required') === 'true' ? 1 : 0,
    installation_required: get('installation_required') === 'true' ? 1 : 0,
    created_by: session.user.id,
  });

  return NextResponse.json({ id });
}