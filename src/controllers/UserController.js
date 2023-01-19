const Users = require('../models/Users.js');
const validateCPF = require('../hooks/validateCPF.js');
const isAnInvalidEmail = require('../hooks/validateEmail.js');
const isAnInvalidPassword = require('../hooks/validatePassword');
const isAnInvalidDate = require('../hooks/validateDate');
const { isGender, genders } = require('../hooks/validateGenderField');
const {
  isAnEthnicGroup,
  ethnic_groups,
} = require('../hooks/validateEthnicGroupField');
const bcrypt = require('bcrypt');
const generateToken = require('../hooks/generateToken');
const { Op } = require('sequelize');

module.exports = {
  async findAll(req, res) {
    try {
      const users = await Users.findAll();
      return res.json(users);
    } catch (e) {
      return res.json(e.message);
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params;

      const user = await Users.findByPk(id);

      if (!user) {
        return res.json({ message: 'Usuário não encontrado' });
      }

      return res.json(user);
    } catch (e) {
      return res.json(e.message);
    }
  },

  async findByRole(req, res) {
    try {
      const { role } = req.params;

      if (
        role !== 'administrador' &&
        role !== 'nutricionista' &&
        role !== 'paciente'
      ) {
        return res.json({
          message: `O valor do parâmetro 'role' deve ser: administrador, nutricionista ou paciente`,
        });
      }

      const users = await Users.findAll({
        where: {
          role: role,
        },
      });

      if (!users) {
        return res.json({ message: 'Nenhum usuário encontrado' });
      }

      return res.json(users);
    } catch (e) {
      return res.json(e.message);
    }
  },

  async findUsersByName(req, res) {
    try {
      const { role } = req.params;
      let { name } = req.query;

      if (!name) {
        name = '';
      }

      if (
        role !== 'administrador' &&
        role !== 'nutricionista' &&
        role !== 'paciente'
      ) {
        return res.json({
          message: `O valor do parâmetro 'role' deve ser: administrador, nutricionista ou paciente`,
        });
      }

      const users = await Users.findAll({
        where: {
          role: role,
          name: {
            [Op.like]: `%${name}%`,
          },
        },
      });

      if (!users) {
        return res.json({ message: 'Nenhum usuário encontrado' });
      }

      return res.json(users);
    } catch (e) {
      return res.json(e.message);
    }
  },

  async create(req, res) {
    try {
      const {
        role,
        cpf,
        name,
        email,
        phone_number,
        password,
        confirm_password,
        birth_date,
        gender,
        ethnic_group,
        crn_number,
        specialty,
      } = req.body;

      // verificação de campos obrigatórios
      if (
        !role ||
        !cpf ||
        !name ||
        !email ||
        !phone_number ||
        !password ||
        !confirm_password ||
        !birth_date ||
        !gender ||
        !ethnic_group
      ) {
        return res
          .status(400)
          .json({ message: 'Preencha os campos obrigatórios' });
      }

      // validação do nome
      if (name.length < 3) {
        return res
          .status(400)
          .json({ message: 'O nome precisa ter no mínimo 3 caracteres' });
      }

      // validação de email
      if (isAnInvalidEmail(email)) {
        const message = isAnInvalidEmail(email).message;
        return res.status(400).json({ message });
      }

      const checkUserEmail = await Users.findOne({
        where: {
          email: email,
        },
      });

      if (checkUserEmail) {
        return res.status(400).json({
          message: 'Esse email já está sendo usado em uma conta',
        });
      }

      // validação de cpf
      const checkUserCpf = await Users.findOne({
        where: {
          cpf: cpf,
        },
      });

      if (checkUserCpf) {
        return res.status(400).json({
          message: 'Esse cpf já está sendo usado',
        });
      }

      if (!validateCPF(cpf)) {
        return res.status(400).json({
          message: 'O cpf informado não é válido',
        });
      }

      // validação de role
      if (
        role !== 'administrador' &&
        role !== 'nutricionista' &&
        role !== 'paciente'
      ) {
        return res.json({
          message: `O valor do campo 'role' deve ser: administrador, nutricionista ou paciente`,
        });
      }

      // validação se o usuário é nutricionista
      if (role === 'nutricionista') {
        if (!crn_number) {
          return res.json({
            message: `O campo 'crn_number' é obrigatório na criação de usuários nutricionistas`,
          });
        }

        if (!specialty) {
          return res.json({
            message: `O campo 'specialty' é obrigatório na criação de usuários nutricionistas`,
          });
        }

        if (
          specialty !== 'nutricao-clinica' &&
          specialty !== 'nutricao-esportiva'
        ) {
          return res.json({
            message: `O valor do campo 'specialty' deve ser: nutricao-clinica ou nutricao-esportiva`,
          });
        }
      }

      if (password != confirm_password) {
        // validação de senha
        return res.status(400).json({
          message:
            "Os campos 'senha' e 'confirme sua senha' precisam ser iguais",
        });
      }

      if (isAnInvalidPassword(password, name)) {
        const message = isAnInvalidPassword(password, name).message;

        return res.status(400).json({ message });
      }

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      // validação da data de aniversário
      if (isAnInvalidDate(birth_date)) {
        return res.json({
          message: `O campo 'birth_date' precisa receber uma data no formato 'yyyy-mm-dd`,
        });
      }

      // validação do campo de gênero
      if (!isGender(gender)) {
        return res.json({
          message: `O campo 'gender' precisa receber um desses valores: '${genders}'`,
        });
      }

      // validação do campo de grupo étnico
      if (!isAnEthnicGroup(ethnic_group)) {
        return res.json({
          message: `O campo 'ethnic_group' precisa receber um desses valores: '${ethnic_groups}'`,
        });
      }

      // criando o usuário
      const newUser = await Users.create({
        name,
        email,
        role,
        phone_number,
        cpf,
        password: passwordHash,
        birth_date,
        gender,
        ethnic_group,
        crn_number,
        specialty,
      });

      return res.json({
        newUser,
        token: generateToken({ user_id: newUser.id }),
      });
    } catch (e) {
      return res.json(e.message);
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        email,
        password,
        confirm_password,
        cpf,
        role,
        phone_number,
        birth_date,
        gender,
        ethnic_group,
        crn_number,
        specialty,
      } = req.body;

      const updatedFields = {};

      const user = await Users.findByPk(id);

      if (!user) {
        return res.json({ message: `Usuário não encontrado` });
      }

      // validação do nome
      if (name) {
        if (name.length < 3) {
          return res
            .status(400)
            .json({ message: 'O nome precisa ter no mínimo 3 caracteres' });
        }

        updatedFields.name = name;
      }

      // validação do email
      if (email) {
        if (isAnInvalidEmail(email)) {
          const message = isAnInvalidEmail(email).message;
          return res.status(400).json({ message });
        }

        const checkUserEmail = await Users.findOne({
          where: {
            email: email,
          },
        });

        if (checkUserEmail && email != user.email) {
          return res.status(400).json({
            message: 'Esse email já está sendo usado em uma conta',
          });
        }

        updatedFields.email = email;
      }

      //validação do número de telefone
      if (phone_number) {
        updatedFields.phone_number;
      }

      // validação de cpf
      if (cpf) {
        const checkUserCpf = await Users.findOne({
          where: {
            cpf: cpf,
          },
        });

        if (checkUserCpf && cpf != user.cpf) {
          return res.status(400).json({
            message: 'Esse cpf já está sendo usado',
          });
        }

        if (!validateCPF(cpf)) {
          return res.status(400).json({
            message: 'O cpf informado não é válido',
          });
        }

        updatedFields.cpf = cpf;
      }

      // validação de role
      if (role) {
        if (
          role !== 'administrador' &&
          role !== 'nutricionista' &&
          role !== 'paciente'
        ) {
          return res.json({
            message: `O valor do campo 'role' deve ser: administrador, nutricionista ou paciente`,
          });
        }

        updatedFields.role = role;
      }

      // validação da senha
      if (password) {
        if (password != confirm_password) {
          return res.status(400).json({
            message:
              "Os campos 'password' e 'confirm_password' precisam ser iguais",
          });
        }

        if (isAnInvalidPassword(password, user.name)) {
          const message = isAnInvalidPassword(password, user.name).message;

          return res.status(400).json({ message });
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        updatedFields.password = passwordHash;
      }

      // validação da data de aniversário
      if (birth_date) {
        if (isAnInvalidDate(birth_date)) {
          return res.json({
            message: `O campo 'birth_date' precisa receber uma data no formato 'yyyy-mm-dd'`,
          });
        }

        updatedFields.birth_date = birth_date;
      }

      // validação do campo de gênero
      if (gender) {
        if (!isGender(gender)) {
          return res.json({
            message: `O campo 'gender' precisa receber um desses valores: [${genders}]`,
          });
        }

        updatedFields.gender = gender;
      }

      // validação do campo de grupo étnico
      if (ethnic_group) {
        if (!isAnEthnicGroup(ethnic_group)) {
          return res.json({
            message: `O campo 'ethnic_group' precisa receber um desses valores: '${ethnic_groups}'`,
          });
        }

        updatedFields.ethnic_group = ethnic_group;
      }

      // removendo crn_number e specialty caso a role de nutricionista tenha sido alterada
      if (role != 'nutricionista') {
        updatedFields.crn_number = null;
        updatedFields.specialty = null;
      } else if (!crn_number || !specialty) {
        return res.json({
          message: `Caso queira fazer desse usuário um nutricionista, é necessário informar os campos de 'crn_number' e 'specialty'`,
        });
      } else {
        if (
          specialty !== 'nutricao-clinica' &&
          specialty !== 'nutricao-esportiva'
        ) {
          return res.json({
            message: `O valor do campo 'specialty' deve ser: nutricao-clinica ou nutricao-esportiva`,
          });
        }

        updatedFields.crn_number = crn_number;
        updatedFields.specialty = specialty;
      }

      // atualizando o usuário
      await Users.update(updatedFields, {
        where: {
          id: Number(id),
        },
      });

      // buscando usuário atualizado para exibir no log
      const updatedUser = await Users.findByPk(id);

      return res.json(updatedUser);
    } catch (e) {
      return res.json(e.message);
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      await Users.destroy({
        where: {
          id: Number(id),
        },
      });

      return res.json({ message: `Usuário #${id} apagado com sucesso!` });
    } catch (e) {
      return res.json(e.message);
    }
  },
};
