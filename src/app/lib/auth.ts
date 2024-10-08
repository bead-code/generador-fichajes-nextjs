import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.SECRET_KEY
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function login(formData: FormData): Promise<NextResponse | void> {

    // Verify credentials && get user data
    const user = await verifyUser(formData);
    if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    // Create the session
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 1 week
    const session = await encrypt({ user, expires });

    // Set the session cookie
    cookies().set('checks-generator-session', session, {
        expires: expires,
        httpOnly: true,
    });
    return NextResponse.json({ "message": "Logged in" }, { status: 200 });
}

export async function logout() {
    cookies().set('checks-generator-session', '', {
        expires: new Date(0),
        httpOnly: true,
    });
}

export async function getSession() {
    const session = cookies().get('checks-generator-session')?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession(req: NextRequest) {
    const session = req.cookies.get('checks-generator-session')?.value;
    if (!session) return null;

    const parsed = await decrypt(session);
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 1 week
    const res = NextResponse.next();
    res.cookies.set({
        name: 'checks-generator-session',
        value: await encrypt(parsed),
        expires,
        httpOnly: true,
    });
}

export async function verifyUser(formData: FormData) {
    console.log('formData', formData);
    const username = formData.get('username');
    const password = formData.get('password');
    if (username === process.env.MAIN_USER && password === process.env.MAIN_PASSWORD) {
        return { username: process.env.MAIN_USER };
    }
    return null;
}