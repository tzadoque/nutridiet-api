// caso a data seja válida a função retorna 'false',

module.exports = function isAnInvalidDate(date) {
  const dateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

  if (!dateRegex.test(date)) {
    return true;
  }

  return false;
};
