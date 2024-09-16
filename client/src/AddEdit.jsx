import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Canvas from './Canvas'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrush,faFont,faCircle,faCaretUp, faSquare, faLineChart } from '@fortawesome/free-solid-svg-icons';
import { fetchDrawingById, saveDrawing } from './services/apiServices';


const AddEdit = () => {
    const { id } = useParams(); // For detecting Edit mode
    const navigate = useNavigate(); // For redirecting after save
    const [drawings, setDrawings] = useState({ lines: [], shapes: [],textAnnotations: [] });
    const [color, setColor] = useState("#000000");
    const [tool, setTool] = useState("");
    
    const canvasRef = useRef(null);
    
    const ctx = useRef(null);
    const base_url=import.meta.env.VITE_BASE_URL

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        setDrawings({ lines: [], shapes: [],textAnnotations:[] });
    };


    useEffect(() => {
        if (id) {
            fetchDrawing();  // Only fetch data if in Edit mode
        }
    }, [id]);

    const fetchDrawing = async () => {
        try {
            const drawing = await fetchDrawingById(id);
            setDrawings({
                lines: drawing.lines || [],
                shapes: drawing.shapes || [],
                textAnnotations: drawing.textAnnotations||[]
            });
        } catch (e) {
            console.log(e);
        }
    };

    const handleSaveDrawing = async () => {
        try {
            const drawingData = {
                title: "title",
                lines: drawings.lines,
                shapes: drawings.shapes,
                textAnnotations: drawings.textAnnotations
            };
            await saveDrawing(id, drawingData);
            alert(id ? "Drawing updated successfully!" : "Drawing added successfully");
            navigate('/'); // Redirect after save
        } catch (e) {
            console.log(e);
        }
    };



    return (
        <div>
            <div className='container-fluid'>
                <div className="row">
                    <h1 className="display-5 pt-4 pb-3 text-center">
                        {id ? "Edit Drawing" : "Add Drawing"} {/* Conditional Title */}
                    </h1>
                </div>
                <div className="row justify-content-center align-items-center text-center py-2">
                    <div className="col-md-2">
                        <div className="color-picker d-flex align-items-center justify-content-center">
                            Color Picker : &nbsp;
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-5">
                    <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="tools"
                                id="text"
                                value="text"
                                checked={tool === "text"}
                                onClick={(e) => setTool(e.target.value)}
                                readOnly={true}
                            />
                            <label className="form-check-label" htmlFor="text">
                            <FontAwesomeIcon size='2x' icon={faFont} style={{color: "#B197FC"}} />
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="tools"
                                id="line"
                                value="line"
                                checked={tool === "line"}
                                onClick={(e) => setTool(e.target.value)}
                                readOnly={true}
                            />
                            <label className="form-check-label" htmlFor="line">
                            <FontAwesomeIcon size='2x' icon={faLineChart} style={{color: "#B197FC"}} />
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="tools"
                                id="circle"
                                value="circle"
                                checked={tool === "circle"}
                                onClick={(e) => setTool(e.target.value)}
                                readOnly={true}
                            />
                            <label className="form-check-label" htmlFor="circle">
                            <FontAwesomeIcon size='2x' icon={faCircle} style={{color: "#B197FC"}} />
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="tools"
                                id="triangle"
                                value="triangle"
                                checked={tool === "triangle"}
                                onClick={(e) => setTool(e.target.value)}
                                readOnly={true}
                            />
                            <label className="form-check-label" htmlFor="circle">
                            <FontAwesomeIcon size='2x' icon={faCaretUp} style={{color: "#B197FC"}} />
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="tools"
                                id="rect"
                                value="rect"
                                checked={tool === "rect"}
                                onClick={(e) => setTool(e.target.value)}
                                readOnly={true}
                            />
                            <label className="form-check-label" htmlFor="rect">
                            <FontAwesomeIcon size='2x' icon={faSquare} style={{color: "#B197FC"}} />
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="brush"
                                id="brush"
                                value="brush"
                                checked={tool === "brush"}
                                onClick={(e) => setTool(e.target.value)}
                                readOnly={true}
                            />
                            <label className="form-check-label" htmlFor="brush">
                            <FontAwesomeIcon size='2x' icon={faBrush} style={{color: "#B197FC"}} />
                            </label>
                        </div>
                    </div>

                    
                    <div className="col-md-1">
                        <div className="color-picker d-flex align-items-center justify-content-center">
                            <button className='btn btn-info' onClick={handleSaveDrawing}>
                                {id ? "Update" : "Save"} {/* Update or Save */}
                            </button>
                            &nbsp;&nbsp;
                            <input
                                type="button"
                                className="btn btn-danger"
                                value="Clear Canvas"
                                onClick={clearCanvas}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <Canvas
                        canvasRef={canvasRef}
                        ctx={ctx}
                        color={color}
                        setDrawings={setDrawings}
                        drawings={drawings}
                        tool={tool}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddEdit;
