document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("data/opinie.json");

        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }

        const reviews = await response.json();

        console.log("Załadowane opinie:", reviews);
        console.log("Liczba opinii:", reviews.length);

    } catch (error) {
        console.error("Nie udało się załadować opinii:", error);
    }
});