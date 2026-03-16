import AppError from "./appError.js";

/**
 * Parses input data that can be:
 * - A JSON string (e.g., "['a', 'b']")
 * - A comma-separated string (e.g., "a, b")
 * - An actual array
 * 
 * @param {any} data - The data to parse
 * @param {string} fieldName - Field name for error message
 * @returns {Array} - Parsed array
 */
export const parseFlexibleArray = (data, fieldName) => {
    if (!data) return [];
    
    if (Array.isArray(data)) return data;

    if (typeof data !== "string") {
        throw new AppError(`Invalid format for ${fieldName}`, 400);
    }

    const trimmed = data.trim();
    if (!trimmed) return [];

    try {
        // Try parsing as JSON first (handles ["a", "b"])
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            return JSON.parse(trimmed);
        }
        
        // Fallback to comma-separated
        return trimmed.split(",").map(item => item.trim()).filter(Boolean);
    } catch (error) {
        // If JSON parse fails but it looks like JSON, it might be malformed
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            throw new AppError(`Malformed JSON in ${fieldName}`, 400);
        }
        // Otherwise, just treat it as a single string or comma separated if we can
        return trimmed.split(",").map(item => item.trim()).filter(Boolean);
    }
};
