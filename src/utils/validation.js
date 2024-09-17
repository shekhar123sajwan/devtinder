const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (firstName.length < 4 || firstName.length > 10) {
    throw new Error("First and last name character should be 4-50");
  } else if (!validMail(email)) {
    throw new Error("Email not valid!");
  } else if (!password) {
    throw new Error("password is not valid!");
  }
};

const validMail = (mail) => {
  return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(
    mail
  );
};

module.exports = { validateSignupData };
