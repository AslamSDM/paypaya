import { NextRequest, NextResponse } from "next/server";
import { type IVerifyResponse, verifyCloudProof } from '@worldcoin/idkit'

export async function POST(req: NextRequest) {
  const proof = await req.json();

  console.log(proof);

  const app_id = "app_staging_5e32fecc3a83581ebf68c2b46432826b" //process.env.APP_ID
  const action = "verify" //process.env.ACTION_ID

  const verifyRes = (await verifyCloudProof(proof, app_id, action)) as IVerifyResponse;

  console.log(verifyRes);

  if (verifyRes.success) {
    // This is where you should perform backend actions if the verification succeeds
    // Such as, setting a user as "verified" in a database
    NextResponse.json(verifyRes, { status: 200})
  } else {
    // This is where you should handle errors from the World ID /verify endpoint. 
    // Usually these errors are due to a user having already verified.
    NextResponse.json(verifyRes, { status: 400})
  }
}