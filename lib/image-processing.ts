/**
 * Utility to resize and compress images on the client side before uploading to Supabase.
 */

export interface ProcessImageOptions {
    maxDim?: number;
    quality?: number;
    type?: "image/jpeg" | "image/png" | "image/webp";
}

export async function processImage(file: File, options: ProcessImageOptions = {}): Promise<File> {
    const { maxDim = 1024, quality = 0.8, type = file.type } = options;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                // Resize logic
                if (width > height) {
                    if (width > maxDim) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    }
                } else {
                    if (height > maxDim) {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (!ctx) return reject(new Error("Could not get canvas context"));

                ctx.drawImage(img, 0, 0, width, height);

                // Use requested type or default to input type
                // For logos, PNG is usually preferred if it has transparency
                const outputType = type === "image/jpeg" || type === "image/png" || type === "image/webp" ? type : "image/jpeg";

                canvas.toBlob(
                    (blob) => {
                        if (!blob) return reject(new Error("Canvas to Blob failed"));
                        const processedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + (outputType === "image/png" ? ".png" : ".jpg"), {
                            type: outputType,
                            lastModified: Date.now(),
                        });
                        resolve(processedFile);
                    },
                    outputType,
                    quality
                );
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

/**
 * Processes an image and returns a base64 DataURL.
 */
export async function processImageToBase64(file: File, options: ProcessImageOptions = {}): Promise<string> {
    const processedFile = await processImage(file, options);
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(processedFile);
    });
}
