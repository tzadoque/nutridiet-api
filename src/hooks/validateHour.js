// caso a hora seja válida a função retorna 'false',

module.exports = function isAnInvalidHour(hour) {
  const hourRegex = /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/;

  if (!hourRegex.test(hour)) {
    return true;
  }

  return false;
};
