export const cartPermission = async (req, res, next) => {
  if (req.user.cartId !== req.params.cid) {
    return res
      .status(401)
      .json({ status: "error", error: "This cart is not yours" });
  }

  next();
};
