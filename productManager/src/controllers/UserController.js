import { userService } from "../repositories/index.js";

export class UserController {
  togglePremium = async (req, res, next) => {
    try {
      console.log("1");
      const user = await userService.getUserById(req.params.uid);
      const newRole = user.role === "PREMIUM" ? "USER" : "PREMIUM";
      console.log("2");

      await userService.update(req.params.uid, { role: newRole });
      console.log("3");
      return res.status(200).send({
        status: "success",
        data: { newRole },
      });
    } catch (error) {
      console.log("entre", error);
      next(error);
    }
  };
}
