// Drawing Schema for a Whiteboard App in MongoDB
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for storing individual line data
const lineSchema = new Schema({
  startX: { type: Number, required: true },
  startY: { type: Number, required: true },
  endX: { type: Number, required: true },
  endY: { type: Number, required: true },
  color: { type: String, default: '#000000' },
  thickness: { type: Number, default: 2 }
});

// Schema for storing individual shape data
const shapeSchema = new Schema({
  type: { type: String, enum: ['rectangle', 'circle', 'triangle'], required: true },
  startX: { type: Number, required: true },
  startY: { type: Number, required: true },
  endX: { type: Number, required: true },
  endY: { type: Number, required: true },
  color: { type: String, default: '#000000' },
  thickness: { type: Number, default: 2 }
});

// Schema for storing individual text annotation data
const textAnnotationSchema = new Schema({
  text: { type: String, required: true },
  positionX: { type: Number, required: true },
  positionY: { type: Number, required: true },
  fontSize: { type: Number, default: 16 },
  color: { type: String, default: '#000000' }
});

// Main Whiteboard drawing schema
const drawingSchema = new Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lines: [lineSchema],
  shapes: [shapeSchema],
  textAnnotations: [textAnnotationSchema]
});

const Drawing = mongoose.model('Drawing', drawingSchema);

module.exports = Drawing;
