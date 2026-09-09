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

    // 初期状態では何も表示しない
    resultCountElement.textContent = "";
    resultsElement.replaceChildren();
}

function normalize(value) {
    return value
        .normalize("NFKC")
        .toLowerCase();
}

function search(query) {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
        return [];
    }

    return dictionary.filter(item => {
        return normalize(item.reading).includes(normalizedQuery);
    });
}

function updateResults(query) {
    // 入力が空なら何も表示しない
    if (!query.trim()) {
        resultCountElement.textContent = "";
        resultsElement.replaceChildren();
        return;
    }

    const results = search(query);

    resultCountElement.textContent = `${results.length}件`;

    resultsElement.replaceChildren();

    if (results.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 2;
        cell.textContent = "該当するデータがありません。";

        row.appendChild(cell);
        resultsElement.appendChild(row);

        return;
    }

    for (const item of results) {
        const row = document.createElement("tr");

        const reading = document.createElement("td");
        reading.textContent = item.reading;

        const name = document.createElement("td");
        name.textContent = item.name;

        row.append(reading, name);

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