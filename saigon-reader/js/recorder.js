// Microphone recording via MediaRecorder (audio/mp4 on Safari, audio/webm elsewhere).

export const canRecord = () => !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

function pickType() {
  for (const t of ["audio/mp4", "audio/webm;codecs=opus", "audio/webm", "audio/ogg"]) {
    if (MediaRecorder.isTypeSupported?.(t)) return t;
  }
  return "";
}

export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  const type = pickType();
  const rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
  const chunks = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  rec.start();
  return {
    stop: () => new Promise((resolve) => {
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        resolve(new Blob(chunks, { type: rec.mimeType || type || "audio/webm" }));
      };
      rec.stop();
    }),
  };
}

export function extFor(type) {
  if (/mp4|m4a|aac/.test(type)) return "m4a";
  if (/ogg/.test(type)) return "ogg";
  if (/wav/.test(type)) return "wav";
  return "webm";
}

export function playBlob(blob) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const a = new Audio(url);
    a.onended = a.onerror = () => { URL.revokeObjectURL(url); resolve(); };
    a.play().catch(resolve);
  });
}
