// caso a data seja válida a função retorna 'false',

module.exports = function isAnInvalidBirthDate(birth_date) {
  // const birthDateRegex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  const birthDateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

  if (!birthDateRegex.test(birth_date)) {
    return true;
  }

  return false;
};
