import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file to ensure fit is within reasonable web limits.
 * Default: Max 1MB, Max Width/Height 1920px
 */
export async function compressImage(file: File): Promise<File> {
    // Options for compression
    const options = {
        maxSizeMB: 1,          // Max file size in MB
        maxWidthOrHeight: 1920, // Max width/height
        useWebWorker: true,    // Use a web worker for better performance
        fileType: file.type as string, // Preserve original file type
    };

    try {
        // Skip compression for small files (< 1MB)
        if (file.size / 1024 / 1024 < 1) {
            return file;
        }

        console.log(`Compressing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);
        const compressedFile = await imageCompression(file, options);
        console.log(`Compressed to ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

        return compressedFile;
    } catch (error) {
        console.warn('Image compression failed, falling back to original file:', error);
        return file;
    }
}
