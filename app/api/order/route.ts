import { NextRequest, NextResponse } from "next/server";
import { addOrder, getStock, deleteOrder } from "@/lib/kv";
import { sendAdminNotification, sendCustomerConfirmation } from "@/lib/email";
import { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

const PRICE_PER_BOTTLE = 22.92;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { naam, email, telefoon, aantal } = body;

    if (!naam || !email || !telefoon || aantal === undefined) {
      return NextResponse.json(
        { success: false, error: "Alle velden zijn verplicht" },
        { status: 400 }
      );
    }

    const parsedAantal = typeof aantal === "number" ? aantal : parseInt(aantal, 10);
    if (isNaN(parsedAantal) || parsedAantal < 1 || parsedAantal > 20) {
      return NextResponse.json(
        { success: false, error: "Aantal moet tussen 1 en 20 zijn" },
        { status: 400 }
      );
    }

    // Check stock
    const currentStock = await getStock();
    if (currentStock < parsedAantal) {
      return NextResponse.json(
        {
          success: false,
          error: currentStock === 0
            ? "Helaas, alle flessen zijn uitverkocht!"
            : `Niet genoeg voorraad. Er zijn nog ${currentStock} flessen beschikbaar.`,
        },
        { status: 409 }
      );
    }

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

    const newStock = await addOrder(order);

    // Send emails (don't fail order if email fails)
    try {
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
    console.error("Order failed:", error);
    return NextResponse.json(
      { success: false, error: `Bestelling mislukt: ${error}` },
      { status: 500 }
    );
  }
}

// DELETE /api/order?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Order ID is verplicht" }, { status: 400 });
    }
    const newStock = await deleteOrder(id);
    return NextResponse.json({ success: true, available: newStock });
  } catch (error) {
    console.error("Delete order failed:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
