import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
const QuickBooks = require('node-quickbooks')
const OAuthClient = require('intuit-oauth');
// import OAuthClient from 'intuit-oauth'

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
  // log with oauthclient
  const authUri = oauthClient.authorizeUri({
    scope: [
      OAuthClient.scopes.Accounting,
      OAuthClient.scopes.Payment,
      // OAuthClient.scopes.Payroll,
      // OAuthClient.scopes.TimeTracking,
      // OAuthClient.scopes.Benefits,
      OAuthClient.scopes.Email,
      OAuthClient.scopes.OpenId,
    ],
    state: 'test',
  });

  // return res.status(200).redirect(307, authUri)
  return NextResponse.redirect(authUri);

  // verify credentials
  // get request token and refresh token

  var qbo = new QuickBooks(clientId,
                          clientSecret,
                          oauthToken,
                          false, // no token secret for oAuth 2.0
                          realmId,
                          false, // use the sandbox?
                          true, // enable debugging?
                          null, // set minorversion, or null for the latest version
                          '2.0', //oAuth version
                          refreshToken);

  // do api call
  return NextResponse.json({
    message: 'Success',
  })
}