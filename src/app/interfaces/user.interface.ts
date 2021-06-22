export interface UserDetailInput {
  username: string;
  password: string;
}

export interface UserDetail {
  name: string;
  email: string;
  id: number;
  displayName: string;
  active: boolean;
  slug: string;
}
