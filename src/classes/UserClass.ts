import * as bcrypt from "bcrypt";
import User from "../interface/user";
import { User as UserModal, validateUser } from "../modals/users";

class UserClass {
  async createUser(userData: User): Promise<User> {
    const { error } = validateUser(userData);
    if (error) return error.details[0].message;

    const user = new UserModal({
      username: userData.username,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      password: userData.password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return user.save();
  }

  getUserId(email: string): User {
    return UserModal.findOne({ email });
  }

  async loginUser(email: string, password: string): Promise<string> {
    let token: string;
    try {
      const user = await this.getUserId(email);
      if (!user) return null;

      const validPassword = bcrypt.compare(password, user.password);
      if (!validPassword) return null;

      token = user.getAuthToken();
    } catch (error) {
      // console.log(error);
    }
    return token;
  }
}

export default UserClass;
