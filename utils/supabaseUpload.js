import { supabase } from "./supabase.js";
import AppError from "./appError.js";

export const uploadToSupabase = async (fileBuffer, bucket, path, contentType) => {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, fileBuffer, {
                contentType,
                upsert: true
            });

        if (error) {
            console.error("Supabase upload error:", error);
            throw new AppError("Failed to upload image to storage", 500);
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(path)

        return publicUrl;
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
}

export const deleteFromSupabase = async (bucket, paths) => {
    if (!paths || paths.length === 0) return;
    
    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove(paths)

        if (error) {
            console.error("Supabase deletion error (rollback failed):", error);
            return false
        }
        return true
    } catch (error) {
        console.error("Rollback error:", error);
        return false
    }
};
