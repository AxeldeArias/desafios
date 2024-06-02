import { userService } from "../repositories/index.js";

export class UserController {
  togglePremium = async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.params.uid);
      const newRole = user.role === "PREMIUM" ? "USER" : "PREMIUM";

      await userService.update(req.params.uid, { role: newRole });
      return res.status(200).send({
        status: "success",
        data: { newRole },
      });
    } catch (error) {
      next(error);
    }
  };
}
