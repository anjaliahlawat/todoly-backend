const bcrypt = require("bcrypt");
const { User, validate } = require("../modals/users");

class UserClass {
  async createUser(name, email, password) {
    if (this.getUserId(email)) {
      let user = new User({
        name,
        email,
        password,
      });

      try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user = await user.save();
        return user;
      } catch (error) {
        console.log(error);
      }
    } else return null;
  }

  async getUserId(email) {
    try {
      return await User.findOne({ email: req.body.email });
    } catch (error) {
      console.log(error);
    }
  }

  async loginUser(email, password) {
    try {
      const user = await this.getUserId(email);
      if (!user) return null;

      const validPassword = bcrypt.compare(password, user.password);
      if (!validPassword) return null;

      return user;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = UserClass;
