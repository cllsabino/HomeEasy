import { RequestAttachment } from '../models/service-request-field';

const maximumAttachmentBytes = 180000;
const maximumImageDimension = 1280;

export function createCompressedImageAttachment(file: File): Promise<RequestAttachment> {
  if (!file || !file.type || file.type.indexOf('image/') !== 0) {
    return Promise.reject(new Error('Selecione somente arquivos de imagem.'));
  }

  return readFileAsDataUrl(file)
    .then(dataUrl => loadImage(dataUrl))
    .then(image => resizeImage(image, file.name));
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Não foi possível ler esta imagem.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('A imagem selecionada está corrompida.'));
    image.src = dataUrl;
  });
}

function resizeImage(image: HTMLImageElement, fileName: string): RequestAttachment {
  const scale = Math.min(1, maximumImageDimension / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('O navegador não conseguiu preparar esta imagem.');
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  let quality = 0.8;
  let dataUrl = canvas.toDataURL('image/jpeg', quality);
  while (getDataUrlBytes(dataUrl) > maximumAttachmentBytes && quality > 0.35) {
    quality -= 0.1;
    dataUrl = canvas.toDataURL('image/jpeg', quality);
  }

  if (getDataUrlBytes(dataUrl) > maximumAttachmentBytes) {
    throw new Error('A imagem ficou grande demais mesmo após a compactação.');
  }

  return { name: fileName, mimeType: 'image/jpeg', dataUrl };
}

function getDataUrlBytes(dataUrl: string) {
  const content = dataUrl.split(',')[1] || '';
  return Math.ceil(content.length * 0.75);
}
