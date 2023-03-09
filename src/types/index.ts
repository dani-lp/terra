import type { Role } from '@prisma/client';

export type UserData = {
  id: string;
  name: string;
  email: string;
  username: string;
  image: string;
  role: Role;
  about: string;
};
