import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { address } = await req.json();

  const token = jwt.sign({ data: address }, process.env.JWT_SECRET ?? "", {
    expiresIn: "1h",
  });

  return NextResponse.json({
    message: JSON.stringify({
      type: "verify",
      token: address,
    }),
  });
}
