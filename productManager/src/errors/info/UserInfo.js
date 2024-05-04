export const generateRegisterRequiredPropertiesError = (user) => {
  return `One or more properties where incomplete or not valid.
      List of require properties: 
          * first_name: nedds to be a String, recived ${user.first_name}
          * last_name: nedds to be a String, recived ${user.last_name}
          * email: nedds to be a String, recived ${user.email}   
          * age: nedds to be a Number, recived ${user.age}   
          * password: nedds to be a String
      `;
};

export const generateLoginRequiredPropertiesError = (user) => {
  return `One or more properties where incomplete or not valid.
      List of require properties: 
          * examil: nedds to be a String, recived ${user.email}
          * password: nedds to be a String
      `;
};
