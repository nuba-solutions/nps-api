import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
const QuickBooks = require('node-quickbooks')
// const OAuthClient = require('intuit-oauth');
import OAuthClient from 'intuit-oauth'

export async function GET(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = await getServerSession(authOptions)
  const token = await getToken({req});

  if (!session) {
    return NextResponse.json({ message: "You must be logged in." }, {status: 401});
  }

    const oauthClient = new OAuthClient({
        clientId: process.env.QUICKBOOKS_CLIENT_ID,
        clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
        environment: 'sandbox',// || 'production',
        redirectUri: process.env.QUICKBOOKS_CALLBACK_URL,
    });

    // Parse the redirect URL for authCode and exchange them for tokens
    const parseRedirect = req.url;

    // Exchange the auth code retrieved from the **req.url** on the redirectUri
    try {

        const authResponse = await oauthClient
        .createToken(parseRedirect)

        console.log('The Token is  ' + JSON.stringify(authResponse));
        return NextResponse.json(authResponse)
    } catch(e: any) {
        console.error('The error message is :' + e.originalMessage);
        console.error(e, e.intuit_tid);
        return NextResponse.json({'success': false})
    }

    return NextResponse.json({'success': true})
}
