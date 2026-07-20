const uuid = 'fe23fde2-62ad-490a-adc6-a870c84fcf5c';
const hex = uuid.replace(/-/g, '');
const base64uuid = Buffer.from(hex, 'hex').toString('base64url');
console.log("Base64 UUID:", base64uuid, base64uuid.length);

const merchantTransactionId = `${base64uuid}${Date.now().toString(36)}`;
console.log("Txn ID:", merchantTransactionId, merchantTransactionId.length);

const decodedHex = Buffer.from(merchantTransactionId.substring(0, 22), 'base64url').toString('hex');
const decodedUuid = [
  decodedHex.slice(0, 8),
  decodedHex.slice(8, 12),
  decodedHex.slice(12, 16),
  decodedHex.slice(16, 20),
  decodedHex.slice(20, 32)
].join('-');

console.log("Decoded UUID:", decodedUuid);
console.log("Match:", decodedUuid === uuid);
