import { NextResponse } from "next/server";

const ETOMIN_URL = (process.env.ETOMIN_API_URL || "https://pagos.etomin.com/api/v1").replace(/\/$/, "");

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Origin": "https://brandiummx.com",
    "Referer": "https://brandiummx.com/", 
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formData, amount, cartItems } = body;

    if (!process.env.ETOMIN_EMAIL || !process.env.ETOMIN_PASSWORD) {
      throw new Error("Faltan las credenciales de Etomin en .env.local");
    }

    // -----------------------------------------
    // 1. SIGNIN
    // -----------------------------------------
    const authRes = await fetch(`${ETOMIN_URL}/signin`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        email: process.env.ETOMIN_EMAIL,
        password: process.env.ETOMIN_PASSWORD,
      }),
    });
    
    const authText = await authRes.text();
    let authData;
    try { authData = JSON.parse(authText); } catch(e) { throw new Error(`Etomin Auth falló: ${authText.substring(0, 50)}`); }
    if (!authData.authToken) throw new Error(authData.error || "No se pudo obtener el token.");

    // -----------------------------------------
    // 2. TOKENIZER
    // -----------------------------------------
    const [month, shortYear] = formData.cardExpiry.split("/");
    const year = shortYear.length === 2 ? `20${shortYear}` : shortYear; 

    const tokenizeRes = await fetch(`${ETOMIN_URL}/card/tokenizer`, {
      method: "POST",
      headers: getHeaders(authData.authToken),
      body: JSON.stringify({
        cardData: {
          cardNumber: formData.cardNumber.replace(/\s/g, ""),
          cardholderName: formData.cardName,
          expirationMonth: month.trim(),
          expirationYear: year.trim(),
        }
      }),
    });
    
    const tokenizeText = await tokenizeRes.text();
    let tokenData;
    try { tokenData = JSON.parse(tokenizeText); } catch(e) { throw new Error(`Etomin Tokenizer falló: ${tokenizeText.substring(0, 50)}`); }
    if (!tokenData.cardNumberToken) throw new Error(tokenData.error || "Error al encriptar la tarjeta.");

    // -----------------------------------------
    // 3. PREPARAR DATOS PARA EL COBRO
    // -----------------------------------------
    const numericAmount = Number(parseFloat(amount).toFixed(2));
    const uniqueOrderId = `ORD-${Date.now()}`;
    
    const nameParts = formData.name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "N/A";

    interface CartItemPayload {
      id: string;
      name: string;
      price: string | number;
      quantity?: number;
    }

    const itemsPayload = (cartItems || []).map((item: CartItemPayload) => ({
      title: item.name,
      amount: Number(parseFloat(item.price.toString()).toFixed(2)),
      quantity: item.quantity || 1,
      id: item.id
    }));

    const salePayload = {
      amount: numericAmount,
      currency: 484,
      reference: uniqueOrderId,
      customerInformation: {
        firstName: firstName,
        lastName: lastName,
        middleName: "",
        email: formData.email,
        phone1: formData.phone,
        city: formData.city || "CDMX",
        address1: formData.address1 || "No provista",
        postalCode: formData.zip || "00000",
        state: formData.state || "CDMX",
        country: "MX",
        ip: req.headers.get("x-forwarded-for") || "127.0.0.1"
      },
      cardData: {
        cardNumberToken: tokenData.cardNumberToken,
        cvv: formData.cardCvc
      },
      items: itemsPayload.length > 0 ? itemsPayload : [{ title: "Servicio", amount: numericAmount, quantity: 1, id: "SRV-01" }],
      redirectUrl: "https://brandiummx.com/checkout"
    };

    // -----------------------------------------
    // 4. SALE (Cobro)
    // -----------------------------------------
    const saleRes = await fetch(`${ETOMIN_URL}/sale`, {
      method: "POST",
      headers: getHeaders(authData.authToken),
      body: JSON.stringify(salePayload),
    });

    const saleText = await saleRes.text();
    let saleData;
    try { saleData = JSON.parse(saleText); } catch(e) { throw new Error(`Etomin Sale Crash 500: ${saleText.substring(0, 80)}`); }

    if (saleData.status === "APPROVED" || saleData.status === "PENDING") {
      return NextResponse.json({ success: true, data: saleData });
    } else {
      return NextResponse.json({ success: false, error: saleData.message || saleData.status || "Pago declinado." }, { status: 400 });
    }

  } catch (error: unknown) {
    let errorMessage = "Error del servidor";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      // Casteo seguro utilizando unknown en lugar de any
      const errWithCause = error as Error & { cause?: unknown };
      if (errWithCause.cause) {
        errorMessage += ` (Causa interna: ${String(errWithCause.cause)})`;
      }
    }
    
    console.error("API Checkout Error:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}