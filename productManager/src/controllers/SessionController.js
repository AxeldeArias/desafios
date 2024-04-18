export class SessionController {
  getToken = async (req, res) => {
    res.send({ message: req.user });
  };
}
