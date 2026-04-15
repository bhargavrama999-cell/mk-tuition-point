const Carousel = require('../models/Carousel');

const getCarousels = async (req, res) => {
  try {
    const carousels = await Carousel.find({});
    res.json(carousels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCarousel = async (req, res) => {
  try {
    const { title } = req.body;
    let image = '';

    if (req.file) {
      // In a real app we might store cloud URL; here we store local path
      image = req.file.path.replace(/\\/g, '/'); 
    }

    if (!title || !image) {
      return res.status(400).json({ message: 'Title and Image are required' });
    }

    const carousel = await Carousel.create({
      title,
      image,
    });

    res.status(201).json(carousel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCarousel = async (req, res) => {
  try {
    const carousel = await Carousel.findById(req.params.id);

    if (carousel) {
      carousel.title = req.body.title || carousel.title;
      if (req.file) {
        carousel.image = req.file.path.replace(/\\/g, '/');
      }

      const updatedCarousel = await carousel.save();
      res.json(updatedCarousel);
    } else {
      res.status(404).json({ message: 'Carousel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCarousel = async (req, res) => {
  try {
    const carousel = await Carousel.findById(req.params.id);

    if (carousel) {
      await carousel.deleteOne();
      res.json({ message: 'Carousel removed' });
    } else {
      res.status(404).json({ message: 'Carousel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCarousels, createCarousel, updateCarousel, deleteCarousel };
