export function saveSession(session) {
  return new Promise((resolve, reject) => {
    session?.save((err) => {
      if (err) {
        reject(err); // Rechazamos la promesa si hay un error
      } else {
        resolve(); // Resolvemos la promesa si se guarda correctamente
      }
    });
  });
}
