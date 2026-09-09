let dictionary = [];

const searchInput = document.getElementById("search");
const resultsElement = document.getElementById("results");
const resultCountElement = document.getElementById("result-count");

async function loadDictionary() {
    const response = await fetch("data/dictionary.json");

    if (!response.ok) {
        throw new Error("Failed to load dictionary.");
    }

    dictionary = await response.json();

    updateResults("");
}

function normalize(value) {
    return value
        .normalize("NFKC")
        .toLowerCase();
}

function search(query) {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
        return dictionary;
    }

    return dictionary.filter(item => {
        return (
            normalize(item.name).includes(normalizedQuery) ||
            normalize(item.reading).includes(normalizedQuery)
        );
    });
}

function updateResults(query) {
    const results = search(query);

    resultCountElement.textContent = `${results.length}件`;

    resultsElement.replaceChildren();

    for (const item of results) {
        const row = document.createElement("tr");

        const name = document.createElement("td");
        name.textContent = item.name;

        const reading = document.createElement("td");
        reading.textContent = item.reading;

        const source = document.createElement("td");
        source.textContent = item.source;

        row.append(name, reading, source);

        resultsElement.appendChild(row);
    }
}

searchInput.addEventListener("input", () => {
    updateResults(searchInput.value);
});

loadDictionary().catch(error => {
    console.error(error);

    resultCountElement.textContent =
        "辞書データの読み込みに失敗しました。";
});