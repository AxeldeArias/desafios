const socket = io(); // config para poder usar socket del lado del cliente
let user;

Swal.fire({
  title: "Identifícate",
  input: "email",
  text: "Ingresá tu email para identificarte en el chat",
  inputValidator: (value) => {
    return !value && "Necesitas ingresar el nombre de usuario para continuar..";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  console.log("entree");
  fetch(`/api/chat`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
});

const chatbox = document.querySelector("#chatbox");
chatbox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    const value = chatbox.value.trim();

    if (value.length > 0) {
      fetch(`/api/chat`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: value,
          email: user,
        }),
      });
      chatbox.value = "";
    }
  }
});

socket.on("chat", (data) => {
  console.log("entree", { data });
  let messageLogs = document.querySelector("#messageLogs");
  let mensajes = "";
  data.forEach((mensaje) => {
    mensajes += `<li>${mensaje.email}: ${mensaje.message}</li>`;
  });
  messageLogs.innerHTML = mensajes;
});
