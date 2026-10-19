declare module '@/assets/users.js' {
  export type UserRole = 'admin' | 'buyer' | 'seller';

  export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }

  export const dummyUsers: User[];
}

export {};
