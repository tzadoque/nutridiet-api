module.exports = {
  genders: ['masculino', 'feminino', 'outros'],

  isGender(gender) {
    const genders = ['masculino', 'feminino', 'outros'];

    if (genders.includes(gender)) {
      return true;
    }

    return false;
  },
};
