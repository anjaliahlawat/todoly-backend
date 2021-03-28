import * as bcrypt from "bcrypt";
import { User, validateUser } from "../modals/users";

class UserClass {
  async createUser(userData) {
    const { error } = validateUser(userData);
    let user: any = {};
    if (error) throw error.details[0].message;

    if (!(await this.getUserId(userData.email))) {
      user = new User({
        username: userData.username,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        password: userData.password,
      });

      try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user = await user.save();
        return user;
      } catch (err) {
        // console.log(error);
      }
    } else return null;
    return true;
  }

  async getUserId(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      // console.log(error);
    }
    return true;
  }

  async loginUser({ email, password }) {
    try {
      const user = await this.getUserId(email);
      if (!user) return null;

      const validPassword = bcrypt.compare(password, user.password);
      if (!validPassword) return null;

      return user;
    } catch (error) {
      // console.log(error);
    }
    return true;
  }
}

export default UserClass;
