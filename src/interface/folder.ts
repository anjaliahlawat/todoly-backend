import { User } from "../models/users";

interface Folder {
  _id: string;
  subtitle: string;
  title: string;
  total: number;
  user: User;
}

export default Folder;
