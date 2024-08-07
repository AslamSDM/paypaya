import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const proof = await req.json();
  
  console.log(proof)

  return NextResponse.json({ message: "Hi" });
}