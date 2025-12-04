export interface TokenPayload {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  username: string;
  superuser: boolean;
  iat: number;
  exp: number;
}