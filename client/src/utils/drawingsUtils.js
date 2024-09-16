// src/utils/drawingUtils.js

export const isPointInsideShape = (shape, x, y) => {
    if (shape.type === "rectangle") {
        return x >= shape.startX && x <= shape.startX + shape.endX &&
              y >= shape.startY && y <= shape.startY + shape.endY;
    } else if (shape.type === "circle") {
        const dist = Math.sqrt(Math.pow(x - shape.startX, 2) + Math.pow(y - shape.startY, 2));
        return dist <= shape.endX; // endX is the radius
    } else if (shape.type === "triangle") {
        // For triangle, approximate with bounding box for simplicity
        return x >= Math.min(shape.startX, shape.endX) && x <= Math.max(shape.startX, shape.endX) &&
              y >= Math.min(shape.startY, shape.endY) && y <= Math.max(shape.startY, shape.endY);
    }
    return false;
};

export const isPointNearLine = (line, x, y) => {
    const distance = Math.sqrt(Math.pow(line.endX - line.startX, 2) + Math.pow(line.endY - line.startY, 2));
    const distToLine = Math.abs((line.endY - line.startY) * x - (line.endX - line.startX) * y + line.endX * line.startY - line.endY * line.startX) / distance;
    return distToLine < 10; // Allow a small tolerance
};

export const isPointNearText = (annotation, x, y) => {
    const textWidth = annotation.fontSize * annotation.text.length; // Simplified width
    const textHeight = annotation.fontSize; // Approximate height with the font size
    return (
        x >= annotation.positionX && x <= annotation.positionX + textWidth &&
        y >= annotation.positionY - textHeight && y <= annotation.positionY
    );
};
