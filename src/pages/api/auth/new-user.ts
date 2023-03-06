import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/db/client';
import { getServerAuthSession } from '../../../server/common/get-server-auth-session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerAuthSession({ req, res });

  if (!session) {
    res.status(401).redirect('/');
  } else {
    const user = await prisma.user.findUnique({
      where: { id: session.user?.id },
    });

    if (user) {
      const newUserData = await prisma.userDetails.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          user: {
            connect: {
              id: user.id,
            },
          },
          userId: user.id,
          role: 'PLAYER',
          username: user.name,
          about: '',
          playerData: {
            create: {}
          },
        },
      });
      console.log(newUserData);

      res.status(201).redirect('/');
    }
  }
}
