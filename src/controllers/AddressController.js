const Users = require('../models/Users');
const Addresses = require('../models/Addresses');

module.exports = {
  async findAllAddresses(req, res) {
    try {
      const addresses = await Addresses.findAll();

      return res.json(addresses);
    } catch (e) {
      return res.json(e.message);
    }
  },

  async findAddressById(req, res) {
    const { address_id } = req.params;

    try {
      const address = await Addresses.findByPk(address_id);

      if (!address) {
        return res.json({ message: 'Endereço não encontrado' });
      }

      return res.json(address);
    } catch (e) {
      return res.json(e.message);
    }
  },

  async findAllUserAddresses(req, res) {
    const { user_id } = req.params;

    const user = await Users.findByPk(user_id, {
      include: { association: 'addresses' },
    });

    if (!user) {
      return res.json({ message: `Usuário não encontrado` });
    }

    if (!user.addresses) {
      return res.json({
        message: `Nenhum endereço encontrado para este usuário`,
      });
    }

    return res.json(user.addresses);
  },

  async create(req, res) {
    const { user_id } = req.params;
    const { zipcode, street, number, state, country, complement } = req.body;

    const user = await Users.findByPk(user_id);

    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    if (!zipcode || !street || !number || !state || !country) {
      return res
        .status(400)
        .json({ message: 'Preencha os campos obrigatórios' });
    }

    try {
      const [address, created] = await Addresses.findOrCreate({
        where: {
          user_id,
          zipcode,
          street,
          number,
          state,
          country,
        },
        defaults: {
          zipcode,
          street,
          number,
          user_id,
          state,
          country,
          complement,
        },
      });

      return created
        ? res.json({ message: `O endereço foi criado`, address })
        : res.json({
            message: `O endereço informado já existe para este usuário`,
            address,
          });
    } catch (e) {
      return res.json(e.message);
    }
  },

  async update(req, res) {
    const { address_id } = req.params;
    const { zipcode, street, number, state, country, complement } = req.body;

    const updatedFields = {
      zipcode,
      street,
      number,
      state,
      country,
      complement,
    };

    try {
      const address = await Addresses.findOne({
        where: {
          id: Number(address_id),
        },
      });

      if (!address) {
        return res.status(400).json({ message: `Endereço não encontrado` });
      }

      await Addresses.update(updatedFields, {
        where: {
          id: Number(address_id),
        },
      });

      const updatedAddress = await Addresses.findByPk(address_id);

      return res.json({ message: `O endereço foi atualizado`, updatedAddress });
    } catch (e) {
      return res.json(e.message);
    }
  },

  async delete(req, res) {
    const { address_id } = req.params;

    try {
      const address = await Addresses.findByPk(address_id);

      if (!address) {
        return res.json({ message: 'Endereço não encontrado' });
      }

      await Addresses.destroy({
        where: {
          id: Number(address_id),
        },
      });

      return res.json({ message: `O endereço foi apagado com sucesso` });
    } catch (e) {
      return res.json(e.message);
    }
  },
};
