const SCALE_FACTOR = 1000; 
const LAT_OFFSET = 90 * SCALE_FACTOR;  
const LNG_OFFSET = 180 * SCALE_FACTOR;  

export const encodeLocation = (lat: number, lng: number): string => {
  const latInt = Math.round(lat * SCALE_FACTOR) + LAT_OFFSET;
  const lngInt = Math.round(lng * SCALE_FACTOR) + LNG_OFFSET;

  const latStr = latInt.toString(36).toUpperCase().padStart(4, '0');
  const lngStr = lngInt.toString(36).toUpperCase().padStart(4, '0');

  let encoded = '';
  for (let i = 0; i < 4; i++) {
    encoded += latStr[i] + lngStr[i];
  }
  return encoded;
};

export const decodeLocation = (encoded: string): { lat: number; lng: number } => {
  if (encoded.length !== 8) {
    throw new Error("Invalid encoded location length");
  }

  let latStr = '';
  let lngStr = '';
  for (let i = 0; i < 8; i += 2) {
    latStr += encoded[i];
    lngStr += encoded[i + 1];
  }

  const latInt = parseInt(latStr, 36);
  const lngInt = parseInt(lngStr, 36);

  const lat = (latInt - LAT_OFFSET) / SCALE_FACTOR;
  const lng = (lngInt - LNG_OFFSET) / SCALE_FACTOR;
  return { lat, lng };
};
