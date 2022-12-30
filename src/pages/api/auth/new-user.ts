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
      const existingUserData = await prisma.userDetails.findFirst({
        where: { user: user },
      });

      if (!existingUserData) {
        const newUserData = await prisma.userDetails.create({
          data: {
            user: {
              connect: {
                id: user.id,
              },
            },
            userId: user.id,
            role: 'PLAYER',
            playerData: {
              create: {}
            },
          },
        });
        console.log(newUserData);
      }

      res.status(201).redirect('/');
    }
  }
}
