import { NextResponse } from "next/server";

const ETOMIN_URL = process.env.ETOMIN_API_URL || "https://pagos.etomin.com/api/v1";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formData, amount, description } = body;

    // 1. Autenticación (SignIn)
    const authRes = await fetch(`${ETOMIN_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.ETOMIN_EMAIL,
        password: process.env.ETOMIN_PASSWORD,
      }),
    });
    
    const authData = await authRes.json();
    if (!authData.authToken) throw new Error("Error autenticando con Etomin");

    const authHeader = {
      Authorization: `Bearer ${authData.authToken}`,
      "Content-Type": "application/json",
    };

    // 2. Tokenizar la Tarjeta
    const tokenizeRes = await fetch(`${ETOMIN_URL}/card/tokenizer`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({
        cardData: {
          cardNumber: formData.cardNumber.replace(/\s/g, ""),
          cardholderName: formData.cardName,
          expirationMonth: formData.cardExpiry.split("/")[0],
          expirationYear: formData.cardExpiry.split("/")[1],
        }
      }),
    });

    const tokenData = await tokenizeRes.json();
    if (!tokenData.cardNumberToken) throw new Error("Error tokenizando tarjeta");

    // 3. Procesar Venta (Sale)
    const salePayload = {
      cardNumberToken: tokenData.cardNumberToken,
      cvc: formData.cardCvc,
      amount: amount.toFixed(2),
      customerEmail: formData.email,
      customerName: formData.name,
      description: description || "Pago de Servicios Brandium Mx",
    };

    const saleRes = await fetch(`${ETOMIN_URL}/sale`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify(salePayload),
    });

    const saleData = await saleRes.json();
    
    if (saleData.status === "APPROVED") {
      return NextResponse.json({ success: true, data: saleData });
    } else {
      return NextResponse.json({ success: false, error: "Pago declinado o pendiente" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}