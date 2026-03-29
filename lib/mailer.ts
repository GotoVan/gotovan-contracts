import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';

function getGraphClient(): Client {
  const credential = new ClientSecretCredential(
    process.env.MICROSOFT_TENANT_ID!,
    process.env.MICROSOFT_CLIENT_ID!,
    process.env.MICROSOFT_CLIENT_SECRET!
  );

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
  });

  return Client.initWithMiddleware({ authProvider });
}

export async function sendContractEmail({
  to,
  clientName,
  reference,
  pdfBuffer,
  language,
}: {
  to: string;
  clientName: string;
  reference: string;
  pdfBuffer: Buffer;
  language: string;
}) {
  const client = getGraphClient();
  const isSpanish = language === 'ES' || language === 'BILINGUAL';

  const subject = isSpanish
    ? `Tu contrato de mudanza GotoVan — Ref: ${reference}`
    : `Your GotoVan removal contract — Ref: ${reference}`;

  const bodyHtml = isSpanish
    ? `
      <div style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto;">
        <div style="border-bottom: 2px solid #1a1a1a; padding-bottom: 16px; margin-bottom: 24px;">
          <strong style="font-size: 18px;">GotoVan</strong>
          <span style="color: #7a7a7a; font-size: 13px; margin-left: 8px;">The Avocado Shop LTD</span>
        </div>
        <p>Estimado/a <strong>${clientName}</strong>,</p>
        <p>Adjunto encontrará su contrato de mudanza con referencia <strong>${reference}</strong>.</p>
        <p>Por favor, léalo detenidamente, fírmelo y devuélvanoslo firmado para confirmar el servicio.</p>
        <p>Si tiene alguna pregunta, no dude en ponerse en contacto con nosotros.</p>
        <br/>
        <p>Un saludo,<br/>
        <strong>GotoVan – The Avocado Shop LTD</strong><br/>
        <a href="mailto:hello@gotovan.co.uk" style="color: #91bcf0;">hello@gotovan.co.uk</a><br/>
        +44 (0) 7394329184</p>
      </div>
    `
    : `
      <div style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto;">
        <div style="border-bottom: 2px solid #1a1a1a; padding-bottom: 16px; margin-bottom: 24px;">
          <strong style="font-size: 18px;">GotoVan</strong>
          <span style="color: #7a7a7a; font-size: 13px; margin-left: 8px;">The Avocado Shop LTD</span>
        </div>
        <p>Dear <strong>${clientName}</strong>,</p>
        <p>Please find attached your removal contract with reference <strong>${reference}</strong>.</p>
        <p>Kindly review it carefully, sign it, and return the signed copy to confirm your booking.</p>
        <p>If you have any questions, please do not hesitate to get in touch.</p>
        <br/>
        <p>Kind regards,<br/>
        <strong>GotoVan – The Avocado Shop LTD</strong><br/>
        <a href="mailto:hello@gotovan.co.uk" style="color: #91bcf0;">hello@gotovan.co.uk</a><br/>
        +44 (0) 7394329184</p>
      </div>
    `;

  const base64Pdf = pdfBuffer.toString('base64');

  const message = {
    subject,
    body: {
      contentType: 'HTML',
      content: bodyHtml,
    },
    toRecipients: [
      {
        emailAddress: {
          address: to,
        },
      },
    ],
    attachments: [
      {
        '@odata.type': '#microsoft.graph.fileAttachment',
        name: `${reference}.pdf`,
        contentType: 'application/pdf',
        contentBytes: base64Pdf,
      },
    ],
  };

  await client
    .api(`/users/${process.env.MICROSOFT_SENDER_EMAIL}/sendMail`)
    .post({ message, saveToSentItems: true });
}