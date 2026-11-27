export async function compressImageFileToDataUrl(
  file: File,
  maxDimension = 960,
  quality = 0.82,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler arquivo de imagem.'));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Conteúdo de imagem inválido.'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagem não suportado.'));
      img.onload = () => {
        let currentMax = maxDimension;
        let currentQuality = quality;
        let dataUrl = '';

        for (let attempt = 0; attempt < 5; attempt++) {
          const scale = Math.min(
            1,
            currentMax / Math.max(img.width || 1, img.height || 1),
          );
          const width = Math.max(1, Math.round(img.width * scale));
          const height = Math.max(1, Math.round(img.height * scale));

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(result.slice(0, 380000));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);

          const mimeType =
            attempt === 0 && file.type === 'image/png'
              ? 'image/png'
              : 'image/jpeg';
          dataUrl = canvas.toDataURL(mimeType, currentQuality);

          if (dataUrl.length <= 360000) {
            resolve(dataUrl);
            return;
          }
          currentMax = Math.round(currentMax * 0.72);
          currentQuality = Math.max(0.45, currentQuality - 0.12);
        }

        resolve(dataUrl);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}
