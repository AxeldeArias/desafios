export const generateAddProductRequiredPropertiesError = () => {
  return "Falta alguno de estos campos obligatorios: code, description, price, stock, thumbnail, title. ";
};

export const generateAddProductThumbailError = () => {
  return "thumbnail debe ser un array de strings";
};
