import { Resend } from "resend";
import { Order } from "./types";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getFromEmail() {
  return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
}

function getAdminEmail() {
  return process.env.ADMIN_EMAIL || "kevin@id.nl";
}

function formatPrice(amount: number): string {
  return amount.toFixed(2).replace(".", ",");
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString("nl-NL", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  });
}

export async function sendAdminNotification(
  order: Order,
  remainingStock: number
): Promise<void> {
  await getResend().emails.send({
    from: `Tavola Rotonda 92 <${getFromEmail()}>`,
    to: getAdminEmail(),
    subject: `🍋 Nieuwe Limoncello bestelling — ${order.aantal}x van ${order.naam}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1B2444; color: #FFFFFF; padding: 32px; border-radius: 8px;">
        <h1 style="color: #D4A843; margin-top: 0;">Nieuwe bestelling ontvangen!</h1>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px 0; color: #B8C0D4;">Naam:</td><td style="padding: 8px 0; color: #FFFFFF;">${order.naam}</td></tr>
          <tr><td style="padding: 8px 0; color: #B8C0D4;">E-mail:</td><td style="padding: 8px 0; color: #FFFFFF;"><a href="mailto:${order.email}" style="color: #D4A843;">${order.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #B8C0D4;">Telefoon:</td><td style="padding: 8px 0; color: #FFFFFF;"><a href="tel:${order.telefoon}" style="color: #D4A843;">${order.telefoon}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #B8C0D4;">Aantal flessen:</td><td style="padding: 8px 0; color: #FFFFFF; font-weight: bold;">${order.aantal}</td></tr>
          <tr><td style="padding: 8px 0; color: #B8C0D4;">Totaalbedrag:</td><td style="padding: 8px 0; color: #D4A843; font-weight: bold; font-size: 18px;">&euro;${formatPrice(order.totaal)}</td></tr>
          <tr><td style="padding: 8px 0; color: #B8C0D4;">Besteld op:</td><td style="padding: 8px 0; color: #FFFFFF;">${formatDate(order.timestamp)}</td></tr>
        </table>
        <div style="background-color: rgba(212, 168, 67, 0.15); padding: 16px; border-radius: 8px; border: 1px solid rgba(212, 168, 67, 0.3); margin: 20px 0;">
          <p style="margin: 0; color: #B8C0D4;">Resterende voorraad: <strong style="color: #D4A843;">${remainingStock}/92</strong></p>
        </div>
        <hr style="border: none; border-top: 1px solid rgba(212, 168, 67, 0.3); margin: 20px 0;" />
        <p style="color: #D4A843; font-weight: bold;">Vergeet niet een Tikkie te sturen naar ${order.naam}!</p>
      </div>
    `,
  });
}

export async function sendCustomerConfirmation(order: Order): Promise<void> {
  const flessenText = order.aantal === 1 ? "fles" : "flessen";

  await getResend().emails.send({
    from: `Tavola Rotonda 92 <${getFromEmail()}>`,
    to: order.email,
    subject:
      "Jouw Limoncello Edizione Limitata reservering is bevestigd! 🍋",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1B2444; color: #FFFFFF; padding: 32px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #D4A843; font-family: Georgia, serif; margin: 0;">Limoncello</h1>
          <p style="color: #B8C0D4; margin: 4px 0 0;">Edizione Limitata</p>
        </div>
        <p style="font-size: 18px;">Ciao ${order.naam}!</p>
        <p style="color: #B8C0D4;">Bedankt voor je reservering van <strong style="color: #FFFFFF;">${order.aantal} ${flessenText}</strong> Limoncello Edizione Limitata.</p>
        <div style="background-color: rgba(212, 168, 67, 0.1); padding: 20px; border-radius: 8px; border: 1px solid rgba(212, 168, 67, 0.3); margin: 24px 0; text-align: center;">
          <p style="margin: 0 0 8px; color: #B8C0D4;">Jouw bestelling:</p>
          <p style="margin: 0; font-size: 20px; color: #FFFFFF;">${order.aantal}x Limoncello Edizione Limitata</p>
          <p style="margin: 8px 0 0; font-size: 24px; color: #D4A843; font-weight: bold;">&euro;${formatPrice(order.totaal)}</p>
        </div>
        <p style="color: #B8C0D4;">Je ontvangt binnenkort een Tikkie van <strong style="color: #D4A843;">&euro;${formatPrice(order.totaal)}</strong> voor de betaling.</p>
        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(212, 168, 67, 0.3);">
          <p style="font-size: 20px; margin: 0;">Salute! 🥂</p>
          <p style="color: #D4A843; margin: 8px 0 0; font-family: Georgia, serif;">Tavola Rotonda 92</p>
        </div>
      </div>
    `,
  });
}
