import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

const FALLBACK_PAYLOADS: Record<string, any> = {
  email: {
    type: "email",
    subject: "URGENT: Verify Your Account Activity Now",
    sender: "Security Team <security@amaz0n-support-verify.com>",
    content: `Dear Customer,\n\nWe detected unusual sign-in activity on your account from a new device in Russia. To prevent permanent suspension, please verify your identity immediately.\n\nClick the link below to review your recent activity and secure your account.\n\nhttps://amaz0n-support-verify.com/login/secure\n\nIf you do not verify within 24 hours, your account will be locked.\n\nRegards,\nThe Security Team`,
    indicators: [
      { text: "amaz0n-support-verify.com", reason: "Spoofed domain. Notice the '0' instead of 'o' in Amazon, and the unofficial TLD." },
      { text: "suspension", reason: "Creates a sense of urgency and fear to manipulate the victim." },
      { text: "within 24 hours", reason: "Artificial time constraint to force quick, irrational decisions." }
    ],
    verdict: "malicious"
  },
  chat: {
    type: "chat",
    subject: "Internal HR Comm",
    sender: "Sarah (HR Manager)",
    content: "Hey, can you review this updated payroll document? Accounting needs it signed by EOD so your direct deposit isn't delayed.\n\nhttp://corp-payroll-portal.auth-login.com/doc_193.pdf",
    indicators: [
      { text: "EOD", reason: "Time pressure to bypass security checks." },
      { text: "direct deposit isn't delayed", reason: "Financial manipulation tactic." },
      { text: "auth-login.com", reason: "Suspicious generic domain used to steal credentials." }
    ],
    verdict: "malicious"
  },
  sms: {
    type: "sms",
    subject: "Delivery Alert",
    sender: "+1 (844) 932-1011",
    content: "USPS: Your package is on hold due to missing address details. Please update here to avoid return to sender: https://usps-tracking-update-hub.com/reschedule",
    indicators: [
      { text: "missing address details", reason: "Common smishing lure." },
      { text: "usps-tracking-update-hub.com", reason: "Fake domain mimicking an official service." }
    ],
    verdict: "malicious"
  },
  voice: {
    type: "voice",
    subject: "Fraud Alert Division",
    sender: "Automated Bank System",
    content: "Hello. This is a call from the fraud prevention department of your bank. We have detected a suspicious charge of $1,492.00 on your account. To stop this transaction, press 1 now to speak to a representative and verify your social security number.",
    indicators: [
      { text: "$1,492.00", reason: "Specific high dollar amount creates panic." },
      { text: "verify your social security number", reason: "Banks do not ask for full SSN over automated outbound calls." }
    ],
    verdict: "malicious"
  },
  video: {
    type: "video",
    subject: "Emergency Executive Sync",
    sender: "CFO Deepfake",
    content: "Hey, I know I look a bit glitchy, the connection here is terrible. I need you to authorize that wire transfer to the Vendor right now. The CEO is furious it hasn't gone through.",
    indicators: [
      { text: "look a bit glitchy", reason: "Deepfakes often use poor connection as an excuse for visual artifacts." },
      { text: "authorize that wire transfer", reason: "Urgent financial requests via video are classic CEO fraud vectors." }
    ],
    verdict: "malicious"
  }
};

const SAFE_FALLBACK_PAYLOADS: Record<string, any> = {
  email: {
    type: "email",
    subject: "Upcoming Q3 Town Hall",
    sender: "Internal Comms <comms@phishverse.io>",
    content: `Hi Team,\n\nJust a reminder that our Q3 Town Hall is scheduled for this Thursday at 2:00 PM EST. We will be discussing our upcoming roadmap and recent successes.\n\nPlease find the calendar invite attached, or view the agenda on the company intranet: https://intranet.phishverse.io/townhall\n\nSee you there!`,
    indicators: [
      { text: "intranet.phishverse.io", reason: "This is a recognized and trusted internal company domain." }
    ],
    verdict: "safe"
  },
  chat: {
    type: "chat",
    subject: "Internal HR Comm",
    sender: "Marcus (Design Lead)",
    content: "Hey, are we still on for the 10:30 sync? I just updated the Figma file with the new mockups.",
    indicators: [
      { text: "10:30 sync", reason: "Standard work communication without urgency or suspicious links." }
    ],
    verdict: "safe"
  },
  sms: {
    type: "sms",
    subject: "Appointment Reminder",
    sender: "Dentist Office",
    content: "Reminder: You have an upcoming dental appointment tomorrow at 9:00 AM. Reply C to confirm or call us at 555-0192 to reschedule.",
    indicators: [
      { text: "Reply C", reason: "Standard appointment confirmation mechanism, no sketchy web links." }
    ],
    verdict: "safe"
  },
  voice: {
    type: "voice",
    subject: "Manager Check-in",
    sender: "Sarah (Engineering Manager)",
    content: "Hey, just calling to see if you needed any help blocking that ticket before the sprint ends. Give me a call back when you can, no rush.",
    indicators: [
      { text: "no rush", reason: "Lack of urgency, a classic sign of legitimate internal communication." }
    ],
    verdict: "safe"
  },
  video: {
    type: "video",
    subject: "Weekly Standup",
    sender: "Scrum Master",
    content: "Morning everyone. Just a quick sync today. Is everyone unblocked for the sprint? Great, let's wrap up.",
    indicators: [
      { text: "unblocked", reason: "Standard agile terminology." }
    ],
    verdict: "safe"
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const targetContext = body.targetContext || "generic employee";
    const format = body.format || "email";
    
    // Support custom payload building
    if (body.customContent) {
       return NextResponse.json({
         type: format,
         subject: body.subject || "Custom Target",
         sender: body.sender || "Unknown",
         content: body.customContent,
         indicators: [{ text: "Custom Payload", reason: "Designed by User in Simulation Builder." }],
         verdict: "malicious"
       });
    }

    // 30% chance to generate a safe communication
    const isSafe = Math.random() < 0.3;
    const targetVerdict = isSafe ? "safe" : "malicious";

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. Using fallback mock scenario.");
      const activeFallbacks = isSafe ? SAFE_FALLBACK_PAYLOADS : FALLBACK_PAYLOADS;
      return NextResponse.json(activeFallbacks[format] || activeFallbacks['email']);
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are an expert cybersecurity educator creating a highly realistic ${targetVerdict} ${format} simulation.
      Generate a convincing ${format} communication targeting the context: ${targetContext}.
      
      Respond STRICTLY in the following JSON format without Markdown formatting or markdown wrappers like \`\`\`json:
      {
        "type": "${format}",
        "subject": "The ${format === 'email' ? 'email subject line' : 'Caller ID or Group Name'}",
        "sender": "The sender name and contact info (phone number, email, or name)",
        "content": "The full text body/transcript. Use newline characters.",
        "indicators": [
          { "text": "Specific text snippet from the content", "reason": "Why this is a proof of it being ${targetVerdict}" }
        ],
        "verdict": "${targetVerdict}"
      }
      
      Make it extremely realistic for the format:
      - If 'sms': Short. If malicious, use a link. If safe, just a standard SMS.
      - If 'chat': Casual tone, Slack/Teams/WhatsApp style.
      - If 'voice': Spoken text directly without bracketed tags or labels (e.g. Do NOT output "[Caller]" or "[Automated Voice]").
      - If 'video': Spoken text directly from the deepfake avatar.
      
      If malicious, include clear phishing red flags (urgency, spoofed domains). 
      If safe, make it a completely standard, benign communication with NO red flags, and the indicators should explain why it is safe (e.g. recognized domain, no urgency).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "{}";
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(cleanedText));
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(FALLBACK_PAYLOADS['email']);
  }
}
