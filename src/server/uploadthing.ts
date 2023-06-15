import { createUploadthing, type FileRouter } from 'uploadthing/server';

const f = createUploadthing();

const auth = (req: Request) => {
  return { id: 'fakeId' };
}; // fake auth function

export const terraFileRouter = {
  proofUploader: f({ image: { maxFileSize: '2MB' } })
    .middleware(async (req) => {
      const user = await auth(req);

      if (!user) {
        throw new Error('Unauthorized');
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      console.log('Upload complete for userId: ', metadata.userId);
    }),
  
  pfpUploader: f({ image: { maxFileSize: '2MB' } })
    .middleware(async (req) => {
      const user = await auth(req);

      if (!user) {
        throw new Error('Unauthorized');
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      console.log('Upload complete for userId: ', metadata.userId);
    }),
} satisfies FileRouter;

export type TerraFileRouter = typeof terraFileRouter;
