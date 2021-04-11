interface User {
  _id: string;
  username: string;
  phoneNumber: string;
  email: string;
  password: string;
  date: Date;
  getAuthToken: () => string;
}

export default User;
