export function emitSocketEventToAll(req, res, eventName, data) {
  try {
    const socket = req.app.get("socket");
    if (socket) {
      socket.emit(eventName, data);
    }
  } catch (e) {
    console.log(e);
  }
}
