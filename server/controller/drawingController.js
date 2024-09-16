const Drawing=require('../model/Drawing')


// get all drawings 
exports.getDrawings=async (req, res) => {
    try {
      const drawings = await Drawing.find();
      res.status(200).json(drawings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

// create a new drawings
exports.createDrawings=async (req, res) => {
    try {
      
      console.log(req.body)
      const drawing = new Drawing(req.body);
      
      await drawing.save();
      res.status(201).json(drawing);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

// get specific drawing by id 
exports.getDrawingById=async (req, res) => {
    try {
      const drawing = await Drawing.findById(req.params.id);
      if (!drawing) {
        return res.status(404).json({ message: 'Drawing not found' });
      }
      res.status(200).json(drawing);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // update a drawing
  exports.updateDrawing=async (req, res) => {
    try {
      const drawing = await Drawing.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!drawing) {
        return res.status(404).json({ message: 'Drawing not found' });
      }
      res.status(200).json(drawing);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  // delete a drawing 
  exports.deleteDrawing=async (req, res) => {
    try {
      const drawing = await Drawing.findByIdAndDelete(req.params.id);
      if (!drawing) {
        return res.status(404).json({ message: 'Drawing not found' });
      }
      res.status(200).json({ message: 'Drawing deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }