export default async function handler(req: any, res: any) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { message } = req.body ?? {};
  if (typeof message !== "string" || !message.trim())
    return res.status(400).json({ error: "Message is required" });
  if (!process.env.GEMINI_API_KEY)
    return res.status(503).json({ error: "Chat service is not configured" });
  return res
    .status(501)
    .json({ error: "Gemini adapter pending deployment configuration" });
}
