class Validator {
  isValid(data) {
    if (data.name === "" || data.surname === "" || data.body === "") {
      return false;
    } else {
      return true;
    }
  }
}

module.exports = Validator;