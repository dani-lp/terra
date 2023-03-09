import type { Challenge, Role } from '@prisma/client';

export type UserData = {
  id: string;
  name: string;
  email: string;
  username: string;
  image: string;
  role: Role;
  about: string;
};

export type DisplayChallenge = Omit<Challenge, 'startDate' | 'endDate'> & {
  startDate: string; // TODO use proper dates
  endDate: string;
  players: number;
  status: 'open' | 'ended';
};
