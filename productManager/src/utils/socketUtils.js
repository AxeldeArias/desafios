export function emitSocketEvent(req, res, eventName, data) {
  try {
    const socket = req.app.get("socket");
    socket.emit(eventName, data);
  } catch {
    res.status(500).send("Error al emitir evento de Socket.IO");
  }
}
