import { NextRequest, NextResponse } from "next/server";
import { decrementStock, saveOrder, getStock } from "@/lib/kv";
import { sendAdminNotification, sendCustomerConfirmation } from "@/lib/email";
import { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

const PRICE_PER_BOTTLE = 22.92;

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10;
}

export async function POST(request: NextRequest) {
  let step = "parsing";
  try {
    const body = await request.json();
    const { naam, email, telefoon, aantal } = body;

    // Validate required fields
    if (!naam || !email || !telefoon || aantal === undefined || aantal === null) {
      return NextResponse.json(
        { success: false, error: "Alle velden zijn verplicht" },
        { status: 400 }
      );
    }

    // Validate types and ranges
    const parsedAantal = typeof aantal === "number" ? aantal : parseInt(aantal, 10);
    if (isNaN(parsedAantal) || parsedAantal < 1 || parsedAantal > 10) {
      return NextResponse.json(
        { success: false, error: "Aantal moet tussen 1 en 10 zijn" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Ongeldig e-mailadres" },
        { status: 400 }
      );
    }

    if (!validatePhone(telefoon)) {
      return NextResponse.json(
        { success: false, error: "Ongeldig telefoonnummer (minimaal 10 cijfers)" },
        { status: 400 }
      );
    }

    // Attempt atomic stock decrement
    step = "stock";
    const newStock = await decrementStock(parsedAantal);

    if (newStock === null) {
      const currentStock = await getStock();
      return NextResponse.json(
        {
          success: false,
          error:
            currentStock === 0
              ? "Helaas, alle flessen zijn uitverkocht!"
              : `Niet genoeg voorraad. Er zijn nog ${currentStock} flessen beschikbaar.`,
        },
        { status: 409 }
      );
    }

    // Create order
    step = "save";
    const order: Order = {
      id: crypto.randomUUID(),
      naam: naam.trim(),
      email: email.trim().toLowerCase(),
      telefoon: telefoon.trim(),
      aantal: parsedAantal,
      totaal: Math.round(parsedAantal * PRICE_PER_BOTTLE * 100) / 100,
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    // Save order
    await saveOrder(order);

    // Send emails (non-blocking - don't fail the order if email fails)
    try {
      step = "email";
      await Promise.all([
        sendAdminNotification(order, newStock),
        sendCustomerConfirmation(order),
      ]);
    } catch (emailError) {
      console.error("Failed to send emails:", emailError);
    }

    return NextResponse.json({
      success: true,
      available: newStock,
      orderId: order.id,
    });
  } catch (error) {
    console.error(`Order failed at step [${step}]:`, error);
    return NextResponse.json(
      { success: false, error: `Bestelling mislukt (${step}). Probeer het opnieuw.` },
      { status: 500 }
    );
  }
}
