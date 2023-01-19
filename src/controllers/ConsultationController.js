const Users = require('../models/Users');
const Consultations = require('../models/Consultations');
const { Op } = require('sequelize');
const isAnInvalidDate = require('../hooks/validateDate');
const isAnInvalidHour = require('../hooks/validateHour');

module.exports = {
  async findAllConsultations(req, res) {
    try {
      const consultations = await Consultations.findAll();

      return res.json(consultations);
    } catch (e) {
      return res.json(e.message);
    }
  },

  async findConsultationById(req, res) {
    const { consultation_id } = req.params;

    try {
      const consultation = await Consultations.findByPk(consultation_id);

      if (!consultation) {
        return res.json({ message: 'Consulta não encontrada' });
      }

      return res.json(consultation);
    } catch (e) {
      return res.json(e.message);
    }
  },

  async findConsultationByPacienteName(req, res) {
    try {
      let { name } = req.query;

      if (!name) {
        name = '';
      }

      const consultations = await Consultations.findAll({
        where: {
          paciente_name: {
            [Op.like]: `%${name}%`,
          },
        },
      });

      if (!consultations) {
        return res.json({ message: 'Nenhuma consulta encontrada' });
      }

      return res.json(consultations);
    } catch (e) {
      return res.json(e.message);
    }
  },

  async create(req, res) {
    const { paciente_id, nutricionista_id, date, hour } = req.body;

    const paciente = await Users.findOne({
      where: {
        id: paciente_id,
        role: 'paciente',
      },
    });

    const nutricionista = await Users.findOne({
      where: {
        id: nutricionista_id,
        role: 'nutricionista',
      },
    });

    if (!nutricionista) {
      return res.status(400).json({ message: 'Nutricionista não encontrado' });
    }

    if (!paciente) {
      return res.status(400).json({ message: 'Paciente não encontrado' });
    }

    if (!date || !hour) {
      return res
        .status(400)
        .json({ message: 'Preencha os campos obrigatórios' });
    }

    // validação da data
    if (isAnInvalidDate(date)) {
      return res.json({
        message: `O campo 'date' precisa receber uma data no formato 'yyyy-mm-dd'`,
      });
    }

    // validação da hora
    if (isAnInvalidHour(hour)) {
      return res.json({
        message: `O campo 'hour' precisa receber uma hora no formato 'hh:mm:ss'`,
      });
    }

    try {
      const [consultation, created] = await Consultations.findOrCreate({
        where: {
          paciente_id,
          nutricionista_id,
          date,
          hour,
        },
        defaults: {
          paciente_name: paciente.name,
          paciente_id,
          nutricionista_id,
          date,
          hour,
        },
      });

      return created
        ? res.json({ message: `A consulta foi criada`, consultation })
        : res.json({
            message: `A consulta informada já havia sido criada`,
            consultation,
          });
    } catch (e) {
      return res.json(e);
    }
  },

  async update(req, res) {
    const { consultation_id } = req.params;
    const { paciente_id, nutricionista_id, date, hour } = req.body;

    const updatedFields = {
      paciente_id,
      nutricionista_id,
    };

    // validação da data
    if (date) {
      if (isAnInvalidDate(date)) {
        return res.json({
          message: `O campo 'date' precisa receber uma data no formato 'yyyy-mm-dd'`,
        });
      }

      updatedFields.date = date;
    }

    // validação da hora
    if (hour) {
      if (isAnInvalidHour(hour)) {
        return res.json({
          message: `O campo 'hour' precisa receber uma hora no formato 'hh:mm:ss'`,
        });
      }

      updatedFields.hour = hour;
    }

    try {
      const consultation = await Consultations.findOne({
        where: {
          id: Number(consultation_id),
        },
      });

      if (!consultation) {
        return res.status(400).json({ message: `Consulta não encontrada` });
      }

      // checa se o paciente foi alterado
      // caso tenha sido, busca o nome do novo paciente e adiciona na atualização
      if (paciente_id) {
        const paciente = await Users.findOne({
          where: {
            id: paciente_id,
            role: 'paciente',
          },
        });

        if (!paciente) {
          return res.json({ message: 'O paciente informado não existe' });
        }

        updatedFields.paciente_name = paciente.name;
      }

      await Consultations.update(updatedFields, {
        where: {
          id: Number(consultation_id),
        },
      });

      const updatedConsultation = await Consultations.findByPk(consultation_id);

      return res.json({
        message: `A consulta foi atualizada`,
        updatedConsultation,
      });
    } catch (e) {
      return res.json(e.message);
    }
  },

  async delete(req, res) {
    const { consultation_id } = req.params;

    try {
      const consultation = await Consultations.findByPk(consultation_id);

      if (!consultation) {
        return res.json({ message: 'Consulta não encontrada' });
      }

      await Consultations.destroy({
        where: {
          id: Number(consultation_id),
        },
      });

      return res.json({ message: `A consulta foi apagada com sucesso` });
    } catch (e) {
      return res.json(e.message);
    }
  },
};
