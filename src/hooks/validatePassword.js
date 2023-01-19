// caso a senha seja válida a função retorna 'false',
// se for inválida a função retorna um objeto com a key 'message' informando qual foi o erro

module.exports = function isAnInvalidPassword(password, name) {
  if (password.length < 8 || password.length > 128) {
    return {
      message: 'A senha precisa ter no mínimo 8 caracteres e no máximo 128.',
    };
  }

  if (Number(password)) {
    return { message: 'A senha não pode conter apenas números.' };
  }

  if (!password.match(/[a-z]+/)) {
    return { message: 'A senha precisa possuir ao menos uma letra minúscula.' };
  }

  if (!password.match(/[A-Z]+/)) {
    return { message: 'A senha precisa possuir ao menos uma letra maiúscula.' };
  }

  if (!password.match(/[0-9]+/)) {
    return { message: 'A senha precisa possuir ao menos um número.' };
  }

  const separatedName = name.split(' ');

  const checkIfPasswordContainsName = separatedName.some((e) => {
    return (
      password.includes(e) || password.toLowerCase().includes(e.toLowerCase())
    );
  });

  if (checkIfPasswordContainsName) {
    return { message: 'A senha não pode conter parte significativa do nome.' };
  }

  return false;
};
