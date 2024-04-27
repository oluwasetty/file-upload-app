

const isImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const arr = (new Uint8Array(reader.result)).subarray(0, 4);
            let header = "";
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            // Check if the header matches image file formats
            if (header === "89504e47" || // PNG
                header === "47494638" || // GIF
                header === "ffd8ffe0" || // JPEG
                header === "ffd8ffe1" || // JPEG
                header === "ffd8ffe2" || // JPEG
                header === "ffd8ffe3" || // JPEG
                header === "ffd8ffe8" || // JPEG
                header === "424d"       // BMP
            ) {
                resolve(true);
            } else {
                resolve(false);
            }
        };
        reader.onerror = () => {
            reject(new Error('Unable to read file'));
        };
        // Read the file as a binary string
        reader.readAsArrayBuffer(file.slice(0, 4));
    });
}

export const checkFiles = async (files) => {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isImg = await isImage(file);
        if (!isImg) {
            return false;
        }
    }
    return true;
}