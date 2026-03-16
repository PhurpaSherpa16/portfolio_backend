import sharp from "sharp"

export const processImage = async (buffer, options = {}) => {
    const { width, height, quality = 80 } = options;
    
    let sharpInstance = sharp(buffer).webp({ quality });

    if (width || height) {
        sharpInstance = sharpInstance.resize({
            width,
            height,
            fit: "cover",
            position: "center"
        });
    }

    return await sharpInstance.toBuffer();
};
