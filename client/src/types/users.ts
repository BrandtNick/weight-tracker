interface User {
  username: string;
  password: string;
}

interface UserProfile {
  _id: string;
  username: string;
}

export type {
  User,
  UserProfile,
};
