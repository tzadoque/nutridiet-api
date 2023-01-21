const { Op } = require('sequelize');
const Foods = require('../models/Foods');

module.exports = {
  async findAllFoods(req, res) {
    try {
      const foods = await Foods.findAll();

      return res.json(foods);
    } catch (e) {
      return res.json(e.message);
    }
  },

  async findFoodById(req, res) {
    const { food_id } = req.params;

    try {
      const food = await Foods.findByPk(food_id);

      if (!food) {
        return res.json({ message: 'Alimento não encontrado' });
      }

      return res.json(food);
    } catch (e) {
      return res.json(e.message);
    }
  },

  async findFoodsByName(req, res) {
    const { name } = req.query;

    const foods = await Foods.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });

    if (!foods) {
      return res.json({ message: `Nenhum alimento encontrado` });
    }

    return res.json(foods);
  },

  async create(req, res) {
    const { name, type, calories, lipids } = req.body;

    if (!name || !type || !calories || !lipids) {
      return res.status(400).json({
        errorMsg: {
          name: 'O campo nome é obrigatório',
          type: 'O campo tipo é obrigatório',
          calories: 'O campo calorias é obrigatório',
          lipids: 'O campo lipídios é obrigatório',
        },
      });
    }

    try {
      const [food, created] = await Foods.findOrCreate({
        where: {
          name,
          type,
          calories,
          lipids,
        },
        defaults: {
          name,
          type,
          calories,
          lipids,
        },
      });

      return created
        ? res.json({ message: `O alimento foi criado`, food })
        : res.json({
            errorMsg: {
              general: `O alimento que você tentou criar já existe`,
            },
            food,
          });
    } catch (e) {
      return res.json(e.message);
    }
  },

  async update(req, res) {
    const { food_id } = req.params;
    const { name, type, calories, lipids } = req.body;

    const updatedFields = {
      name,
      type,
      calories,
      lipids,
    };

    try {
      const food = await Foods.findOne({
        where: {
          id: Number(food_id),
        },
      });

      if (!food) {
        return res.status(400).json({ message: `Alimento não encontrado` });
      }

      await Foods.update(updatedFields, {
        where: {
          id: Number(food_id),
        },
      });

      const updatedFood = await Foods.findByPk(food_id);

      return res.json({ message: `O alimento foi atualizado`, updatedFood });
    } catch (e) {
      return res.json(e.message);
    }
  },

  async delete(req, res) {
    const { food_id } = req.params;

    try {
      const food = await Foods.findByPk(food_id);

      if (!food) {
        return res.json({ message: 'Alimento não encontrado' });
      }

      await Foods.destroy({
        where: {
          id: Number(food_id),
        },
      });

      return res.json({ message: `O alimento foi apagado com sucesso` });
    } catch (e) {
      return res.json(e.message);
    }
  },
};
