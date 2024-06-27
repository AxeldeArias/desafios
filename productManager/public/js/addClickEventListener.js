export function addDeleteEventListener() {
  document.querySelectorAll(".deleteButton").forEach((button) => {
    const handleClick = (event) => {
      const _id = event.target.getAttribute("data-id");
      fetch(`/api/products/${_id}`, {
        method: "DELETE",
      }).then(() => {
        button.removeEventListener("click", handleClick);
      });
    };

    button.addEventListener("click", handleClick);
  });
}

export function addEditEventListener() {
  document.querySelectorAll(".editButton").forEach((button) => {
    const handleClick = (event) => {
      const _id = event.target.getAttribute("data-id");

      window.location.href = `/editProduct/${_id}`;
      button.removeEventListener("click", handleClick);
    };

    button.addEventListener("click", handleClick);
  });
}
