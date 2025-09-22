import { YastaResponse } from "@/types";

export async function sendTextMessage(message: string): Promise<YastaResponse> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) throw new Error("Error sending message");
  return response.json();
}

export async function sendAudioMessage(
  audioBlob: Blob
): Promise<YastaResponse> {
  const formData = new FormData();
  formData.append("audio", audioBlob);

  const response = await fetch("/api/voice", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Error sending audio");
  return response.json();
}
