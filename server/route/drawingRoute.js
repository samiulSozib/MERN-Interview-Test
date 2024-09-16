const router=require('express').Router()
const {getDrawings,createDrawings,getDrawingById,updateDrawing,deleteDrawing}=require('../controller/drawingController')


//create drawing
router.post('/',createDrawings)


// update drawing
router.put('/:id',updateDrawing)

// delete drawing
router.delete('/:id',deleteDrawing)

//get drawing by id
router.get('/:id',getDrawingById)

// get drawings 
router.get('/',getDrawings)

module.exports=router