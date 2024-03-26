import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import QuickBooks from 'node-quickbooks';
const QuickBooks = require('node-quickbooks')
const OAuthClient = require('intuit-oauth');
// import OAuthClient from 'intuit-oauth'
import { promisify } from 'util';

export async function GET(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = await getServerSession(authOptions)
  const token = await getToken({req});

  if (!session) {
    return NextResponse.json({ message: "You must be logged in." }, {status: 401});
  }

  const qbo = new QuickBooks(process.env.QUICKBOOKS_CLIENT_ID,
                          process.env.QUICKBOOKS_CLIENT_SECRET,
                          '',
                          true, // no token secret for oAuth 2.0
                          process.env.QUICKBOOKS_REALM_ID,
                          true, // use the sandbox?
                          true, // enable debugging?
                          null, // set minorversion, or null for the latest version
                          '2.0', //oAuth version
                          process.env.QUICKBOOKS_REFRESH_TOKEN);

  //   console.log(process.env.QUICKBOOKS_CLIENT_ID,
  //                         process.env.QUICKBOOKS_CLIENT_SECRET)
  // const refreshAccessToken = promisify(qbo.refreshAccessToken)
  // const ress = await refreshAccessToken(true);
  // console.log(ress)
  qbo.refreshAccessToken(function (_, data1, data2) {
    console.log('refreshtoken', '_', _, 'data1', data1, 'data2', data2)

    qbo.getCompanyInfo(process.env.QUICKBOOKS_REALM_ID, function(_,data1, data2) {
      console.log('getcompanyinfo', '_', _, 'data1', data1, 'data2', data2)
    })

    qbo.findInvoices(null, function(_,data1, data2) {
      console.log('findinvoices', '_', _, 'data1', data1, 'data2', data2)
    })

  })
  // do api call
  return NextResponse.json({
    message: 'Success',
  })
}
