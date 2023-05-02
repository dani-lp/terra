import { terraFileRouter } from '@/server/uploadthing';
import { createNextPageApiHandler } from 'uploadthing/server';

const handler = createNextPageApiHandler({
  router: terraFileRouter,
});

export default handler;
