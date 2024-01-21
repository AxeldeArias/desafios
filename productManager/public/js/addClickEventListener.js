export function addClickEventListener() {
  document.querySelectorAll(".buttons").forEach((button) => {
    button.addEventListener("click", (event) => {
      const _id = event.target.getAttribute("data-id");
      fetch(`/api/products/${_id}`, {
        method: "DELETE",
      });
    });
  });
}
