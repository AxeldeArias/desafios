export function addClickEventListener() {
  document.querySelectorAll(".buttons").forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = event.target.getAttribute("data-id");
      fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
    });
  });
}
