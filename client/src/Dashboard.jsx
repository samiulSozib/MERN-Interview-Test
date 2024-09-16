import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import rough from 'roughjs/bundled/rough.esm.js';

const Dashboard = () => {
    const [data, setData] = useState([]) // Contains the drawings data from the backend
    const navigate = useNavigate()
    const generator=rough.generator()
    const base_url=import.meta.env.VITE_BASE_URL
    // Fetch drawings when the component mounts
    useEffect(() => {
        fetchDrawings();
    }, [])

    // Function to fetch drawings from the backend
    const fetchDrawings = async () => {
        try {
            const response = await axios.get(`${base_url}/`)
            setData(response.data); // Assuming response.data contains the drawings
        } catch (e) {
            console.log(e)
        }
    }

    const handleDrawing = (id) => {
        navigate(`/edit/${id}`)
    }

    // Handle deletion of a drawing

    const handleDelete = async (id) => {
        // Show confirmation dialog before deleting
        const confirmDelete = window.confirm('Are you sure you want to delete this drawing?');
        
        if (confirmDelete) {
            try {
                await axios.delete(`${base_url}/${id}`) 
                setData(data.filter((drawing) => drawing._id !== id)) 
                alert('Drawing deleted successfully!');
            } catch (e) {
                console.log(e)
                alert('Error deleting drawing.');
            }
        } else {
            alert('Deletion cancelled.');
        }
    }


    // Function to render a drawing on the canvas using rough.js
    const renderDrawing = (canvas, drawing) => {
        const ctx = canvas.getContext("2d");
        const roughCanvas = rough.canvas(canvas);
        canvas.width = 400;
        canvas.height = 360;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing

        drawing.lines.forEach((line)=>{
            roughCanvas.draw(
              generator.line(line.startX,line.startY,line.endX,line.endY,{color:line.color,thickness:line.thickness,roughness: 0})
            )
          })
    
          drawing.shapes.forEach((shape)=>{
            if(shape.type==="rectangle"){
              roughCanvas.draw(
                generator.rectangle(shape.startX,shape.startY,shape.endX,shape.endY,{color:shape.color,thickness:shape.thickness,roughness:0})
              )
            }else if(shape.type==="circle"){
                roughCanvas.draw(
                  generator.circle(shape.startX,shape.startY,shape.endX,{color:shape.color,thickness:shape.thickness,roughness:0})
                )
              }else if(shape.type==="triangle"){
                const midX = (shape.startX + shape.endX) / 2;
                const height = Math.abs(shape.endY - shape.startY); 
                const thirdPointY = shape.startY - height; 
      
                roughCanvas.polygon([
                    [shape.startX, shape.startY], 
                    [shape.endX, shape.endY],    
                    [midX, thirdPointY]        
                ], {
                    stroke: shape.color,
                    strokeWidth: shape.thickness
                });
              }
          })

          
    }

    useEffect(() => {
        data.forEach((drawing, index) => {
            const canvas = document.getElementById(`drawingCanvas-${index}`);
            if (canvas && drawing) {
                renderDrawing(canvas, drawing); // Render each drawing in its canvas
            }
        });
    }, [data]);

    return (
        <div className="container mt-3">
        <nav className="navbar navbar-light bg-light justify-content-between">
            <a className="navbar-brand">Whiteboard</a>
            <NavLink to="/add" className="btn btn-primary">Add Drawing</NavLink>
        </nav>
        <div className="row">
            {data.length > 0 ? (
                data.map((drawing, index) => (
                    <div className="col-4 col-md-4" key={index}>
                        <div className="card mb-3">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">Drawing {index + 1}</h5>
                                    {/* Add the delete button on the right side of the title */}
                                    <button 
                                        className="btn btn-danger btn-sm" 
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent card click from triggering
                                            handleDelete(drawing._id)
                                        }}>
                                        Delete
                                    </button>
                                </div>
                                {/* Add a canvas element to show the drawing preview */}
                                <canvas id={`drawingCanvas-${index}`} style={{ width: "100%", height: "auto", border: "1px solid black" }} onClick={()=>handleDrawing(drawing._id)}/>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="col-12">No drawings available.</p>
            )}
        </div>
    </div>
    )
}

export default Dashboard
