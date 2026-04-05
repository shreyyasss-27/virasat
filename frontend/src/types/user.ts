export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  profilePic: string;
  location: string;
  role: string[];
  iSOnboarded: boolean;
  status: 'PENDING_APPROVAL' | string;
  createdAt: string;
  updatedAt: string;
}