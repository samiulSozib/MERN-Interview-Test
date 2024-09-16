import React, { useEffect,useLayoutEffect, useState,useRef } from 'react'
import rough from "roughjs/bundled/rough.esm";
import { isPointInsideShape, isPointNearLine, isPointNearText } from './utils/drawingsUtils';

const Canvas = ({canvasRef,ctx,color,setDrawings,drawings,tool}) => {

    const [isDrawing,setIsDrawing]=useState(false)
    const generator=rough.generator()
    const [textboxVisible, setTextboxVisible] = useState(false);
    const [textboxPosition, setTextboxPosition] = useState({ x: 0, y: 0 });
    const [textboxValue, setTextboxValue] = useState('');
    const inputRef = useRef(null);
   

    useEffect(()=>{
        const canvas=canvasRef.current;
        canvas.height=window.innerHeight*2;
        canvas.width=window.innerWidth*2;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        const context = canvas.getContext("2d");

        context.strokeWidth = 5;
        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = color;
        context.lineWidth = 5;
        ctx.current = context;
       

        
      
    },[])



    useEffect(() => {
        ctx.current.strokeStyle = color;
      }, [color]);


      useEffect(() => {
        if (textboxVisible) {
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus(); // Focus the input element after a short delay
                }
            }, 0);
        }
    }, [textboxVisible]);



    // util function for remove 

      const handleMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        

        if (tool === "brush") {
            // Check if a line is near the click point
            const foundLine = drawings.lines.find(line => isPointNearLine(line, offsetX, offsetY));
            if (foundLine) {
                // Remove line from drawings
                setDrawings(prevDrawings => {
                    const newLines = prevDrawings.lines.filter(line => line !== foundLine);
                    return { ...prevDrawings, lines: newLines };
                });
                return;
            }

            // Check if a shape is near the click point
            const foundShape = drawings.shapes.find(shape => isPointInsideShape(shape, offsetX, offsetY));
            if (foundShape) {
                // Remove shape from drawings
                setDrawings(prevDrawings => {
                    const newShapes = prevDrawings.shapes.filter(shape => shape !== foundShape);
                    return { ...prevDrawings, shapes: newShapes };
                });
                return;
            }

            // Check if a text annotation is near the click point
            const foundText = drawings.textAnnotations.find(annotation => isPointNearText(annotation, offsetX, offsetY));
            if (foundText) {
                // Remove text annotation from drawings
                setDrawings(prevDrawings => {
                    const newTextAnnotations = prevDrawings.textAnnotations.filter(annotation => annotation !== foundText);
                    return { ...prevDrawings, textAnnotations: newTextAnnotations };
                });
                return;
            }
        }
    
        else if (tool === "line") {
          
          const newLine = { startX: offsetX, startY: offsetY, endX: offsetX, endY: offsetY,color:color,stroke:color};
          console.log(newLine)
          setDrawings(prevDrawings => ({
            ...prevDrawings,
            lines: [...prevDrawings.lines, newLine]
          }));
        }else if(tool==="rect"){
          const newRect={startX:offsetX,startY:offsetY,type:"rectangle",color:color,stroke:color}
            setDrawings(prevDrawings=>({
              ...prevDrawings,
              shapes:[...prevDrawings.shapes,newRect]
            }));
          }else if(tool==="circle"){
            const newCircule={startX:offsetX,startY:offsetY,type:"circle",color:color,stroke:color}
            setDrawings(prevDrawings=>({
              ...prevDrawings,
              shapes:[...prevDrawings.shapes,newCircule]
            }))
          }else if(tool==="triangle"){
            const newTriangle={startX:offsetX,startY:offsetY,type:"triangle",color:color,stroke:color,thickness:2}
            setDrawings(prevDrawings=>({
              ...prevDrawings,
              shapes:[...prevDrawings.shapes,newTriangle]
            }))
          }else if (tool === "text") {
            
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect(); // Get canvas position and size
            
            // Calculate the correct position for the textbox relative to the canvas
            const scaledX = (e.clientX - rect.left); 
            const scaledY = (e.clientY - rect.top);
            
            setTextboxPosition({ x: scaledX, y: scaledY });
            setTextboxVisible(true);
       

          }
        
        
        setIsDrawing(true);
    };
    

    const handleMouseUp=()=>{
      //console.log(drawings)
        setIsDrawing(false)
    }

  

    const handleMouseMove=(e)=>{
        if(!isDrawing){
            return;
        }
        // console.log(isDrawing)
        const {offsetX,offsetY}=e.nativeEvent
        if(tool==="rect"){
            setDrawings(prevDrawings=>({
              ...prevDrawings,
              shapes:prevDrawings.shapes.map((ele,index)=>index===prevDrawings.shapes.length-1?{...ele,endX:offsetX-ele.startX,endY:offsetY-ele.startY}:ele)
            }))
            
        }else if(tool==="line"){
            setDrawings(prevDrawings=>({
              ...prevDrawings,
              lines:prevDrawings.lines.map((ele,index)=>index===prevDrawings.lines.length-1?{...ele,endX:offsetX,endY:offsetY}:ele)
            }))
        }else if(tool==="circle"){
            const radius = Math.sqrt(
              Math.pow(offsetX - drawings.shapes[drawings.shapes.length - 1].startX, 2) +
              Math.pow(offsetY - drawings.shapes[drawings.shapes.length - 1].startY, 2)
          );

            setDrawings((prevDrawings) => ({
                ...prevDrawings,
                shapes: prevDrawings.shapes.map((ele, index) =>
                    index === prevDrawings.shapes.length - 1
                        ? { ...ele, endX: radius, endY: radius }
                        : ele
                )
            }));
        }else if(tool==="triangle"){
          
          setDrawings(prevDrawings => ({
            ...prevDrawings,
            shapes: prevDrawings.shapes.map((ele, index) =>
                index === prevDrawings.shapes.length - 1
                    ? {
                        ...ele,
                        type: "triangle",
                        endX: offsetX,
                        endY: offsetY,
                    }
                    : ele
                )
          }));
        }
        console.log(drawings)
    }

    const handleTextboxSubmit = () => {
      if (textboxValue) {
          const newTextAnnotation = {
              text: textboxValue,
              positionX: textboxPosition.x,
              positionY: textboxPosition.y,
              fontSize: 16,
              color: color,
              stroke:color
          };

          setDrawings(prevDrawings => ({
              ...prevDrawings,
              textAnnotations: [...prevDrawings.textAnnotations, newTextAnnotation],
          }));
      }
      setTextboxVisible(false); // Hide textbox after submitting
      setTextboxValue(''); // Clear textbox
  };



    useLayoutEffect(() => {
        
      const canvas = canvasRef.current;

      // Ensure canvasRef and context are initialized
      if (!canvas || !ctx.current) return; 
    
      const roughCanvas = rough.canvas(canvas);
    
      // Clear the entire canvas using the native 2D context
      if (ctx.current) {
        ctx.current.clearRect(0, 0, canvas.width, canvas.height);
      }

      drawings.lines.forEach((line)=>{
        roughCanvas.draw(
          generator.line(line.startX,line.startY,line.endX,line.endY,{stroke:line.stroke,color:line.color,thickness:line.thickness,roughness: 0})
        )
      })

      drawings.shapes.forEach((shape)=>{
        if(shape.type==="rectangle"){
          roughCanvas.draw(
            generator.rectangle(shape.startX,shape.startY,shape.endX,shape.endY,{stroke:shape.color,color:shape.color,thickness:shape.thickness,roughness:0})
          )
        }else if(shape.type==="circle"){
          roughCanvas.draw(
            generator.circle(shape.startX,shape.startY,shape.endX,{stroke:shape.color,color:shape.color,thickness:shape.thickness,roughness:0})
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
              color:color,
              stroke: shape.color,
              strokeWidth: shape.thickness
          });
        }
      })

      // Draw text annotations
    drawings.textAnnotations.forEach((annotation) => {
      ctx.current.font = `${annotation.fontSize}px Arial`;
      ctx.current.fillStyle = annotation.color;
      
      ctx.current.fillText(annotation.text, annotation.positionX, annotation.positionY);
    });

        
      }, [drawings]);


    
  return (
    <div className='col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-8' 
    style={{height:"500px", position: "relative"}} // Set the parent div to relative
    onMouseDown={handleMouseDown}
    onMouseUp={handleMouseUp}
    onMouseMove={handleMouseMove}
    >
        <canvas ref={canvasRef}/>
        {textboxVisible && (
                <div style={{ position: 'absolute', left: textboxPosition.x, top: textboxPosition.y, background: 'white', border: '1px solid black' }}>
                    <input
                        type="text"
                       ref={inputRef}
                        value={textboxValue}
                        onChange={(e) => setTextboxValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleTextboxSubmit()}
                        autoFocus
                    />
                    
                </div>
            )}
      </div>
  )
}

export default Canvas