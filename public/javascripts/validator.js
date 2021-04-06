class Validator {
  isValid(data) {
    if (data.name.trim() === "" || data.surname.trim() === "" || data.body.trim() === "") {
      return false;
    } else {
      return true;
    }
  }
}

module.exports = Validator;