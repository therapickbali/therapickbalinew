import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const validEmail = process.env.ADMIN_EMAIL;
        const validPassword = process.env.ADMIN_PASSWORD;

        if (!validEmail || !validPassword) {
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        if (email === validEmail && password === validPassword) {
            const response = NextResponse.json(
                { success: true },
                { status: 200 }
            );

            // Set a secure HTTP-only cookie
            response.cookies.set({
                name: 'admin_auth',
                value: 'authenticated',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                // Expires in 7 days
                maxAge: 60 * 60 * 24 * 7,
            });

            return response;
        }

        return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
