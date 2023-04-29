import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAuthSession } from '../../../server/common/get-server-auth-session';
import { prisma } from '../../../server/db/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerAuthSession({ req, res });

  const rawCallbackUrl = req.query.callbackUrl;
  const unknownCallbackUrl = Array.isArray(rawCallbackUrl) ? rawCallbackUrl[0] : rawCallbackUrl;
  const callbackUrl = unknownCallbackUrl ? unknownCallbackUrl : '/';

  const splitCallbackUrl = callbackUrl.split('/');
  const callbackUrlIsNewOrg = splitCallbackUrl[splitCallbackUrl.length - 1] === 'new';

  if (!session) {
    res.status(401).redirect(callbackUrl);
  } else {
    const user = await prisma.user.findUnique({
      where: { id: session.user?.id },
    });

    if (user) {
      const userDetails = await prisma.userDetails.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          user: {
            connect: {
              id: user.id,
            },
          },
          userId: user.id,
          role: callbackUrlIsNewOrg ? 'ORGANIZATION' : 'PLAYER',
          username: user.name?.replace(/ /g, '_') || '',
          about: '',
          playerData: {
            create: {},
          },
        },
      });

      if (callbackUrlIsNewOrg) {
        await prisma.organizationData.upsert({
          where: { userDetailsId: userDetails.id },
          update: {},
          create: {
            userDetails: {
              connect: {
                id: userDetails.id,
              },
            },
            name: '',
            image: '',
            website: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            accepted: false,
          },
        });
      }

      res.status(201).redirect(callbackUrl);
    }
  }
}
