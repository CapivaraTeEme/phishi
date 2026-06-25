async function main() {
    const userAgent = navigator.userAgent;

    try {
        await fetch("/api/logger", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userAgent })
        });
    } catch (error) {
        console.error("Error al enviar los datos al servidor:", error);
    } finally {
        window.location.href = "https://discord.gg/7y9ET5phfg";
    }
}

window.addEventListener("load", main);
