import { compare, genSalt, hash } from "bcrypt";
import { UserModel, validateUser, User } from "../models/users";

class UserClass {
  async createUser(userData: User): Promise<User> {
    const { error } = validateUser(userData);
    if (error) return error.details[0].message;

    const user = new UserModel({
      username: userData.username,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      password: userData.password,
    });

    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);
    return user.save();
  }

  async getUserId(email: string): Promise<User> {
    return UserModel.findOne({ email });
  }

  async loginUser(email: string, password: string): Promise<string> {
    let token: string;
    try {
      const user = await this.getUserId(email);
      if (!user) return null;

      const validPassword = compare(password, user.password);
      if (!validPassword) return null;

      token = user.getAuthToken();
    } catch (error) {
      // console.log(error);
    }
    return token;
  }
}

export default UserClass;
