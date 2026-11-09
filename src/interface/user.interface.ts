export interface IUserData {
  status: string;
  accessToken: string;
  data: Data;
}

interface Data {
  user: User;
}

interface User {
  id: number;
  email: string;
  name: string;
  photo: null;
  createdAt: string;
  role: string;
  active: boolean;
  passwordResetToken: null;
  passwordResetExpires: null;
}
