import { db } from "@/lib/db";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    const { address,email,phone } = await req.json();
    const user = await db.user.findFirst({
        where: {
            address: address,
        },
    });
    if (user) {
        return {
            status: 200,
            body: JSON.stringify({
                message: "User already exists",
            }),
        };
    }
    await db.user.create({
        data: {
            address: address,
            email: email,
            phone: phone,
        },
    });
    return {
        status: 200,
        body: JSON.stringify({
            message: "User created successfully",
        }),
    };
}   