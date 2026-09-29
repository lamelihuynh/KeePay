export interface User {
  id: string;
  displayName: string;
}
export interface Session {
  accessToken: string;
  user: User;
}
