import { User } from "../Models/User.js";

export const createUser = async (req, res) => {
  const user = new User(req.body);

  try {
    const docs = await user.save();
    res.status(200).json({ id: docs.id, role: doc.role });
  } catch (error) {
    res.status(400).json(error);
  }
};
export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
      // TODO: this is just temporary, we will use strong password auth
      res.status(401).json({ message: "No such user email" });
    } else if (user.password === req.body.password) {
      // TODO: We will make addresses independent of login
      res.status(200).json({
        id: user.id,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
