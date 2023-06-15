import { terraFileRouter } from '@/server/uploadthing';
import { createNextPageApiHandler } from 'uploadthing/next-legacy';

const handler = createNextPageApiHandler({
  router: terraFileRouter,
});

export default handler;
