function drawItem(chestItems = [
    { name: "普通物品", probability: 0.7 },
    { name: "稀有物品", probability: 0.2 },
    { name: "超稀有物品", probability: 0.08 },
    { name: "傳說物品", probability: 0.02 }
]) {
    const random = Math.random(); // random 0~1
    let cumulativeProbability = 0;

    for (const item of chestItems) {
        cumulativeProbability += item.probability;
        if (random < cumulativeProbability) {
            return item.name;
        }
    }
}

// Simulate multiple treasure chest openings
function simulateDraws(times, chestItems = [
    { name: "普通物品", probability: 0.7 },
    { name: "稀有物品", probability: 0.2 },
    { name: "超稀有物品", probability: 0.08 },
    { name: "傳說物品", probability: 0.02 }
]) {
    // Initialize results dynamically based on chestItems
    const results = {};

    chestItems.forEach(item => {
        results[item.name] = 0;
    });

    for (let i = 0; i < times; i++) {
        const item = drawItem(chestItems);
        results[item]++;
    }

    return results;
}

// Simulate opening a treasure chest 1,000 times
// const result = simulateDraws(1000);
// console.log(result);

export { drawItem, simulateDraws };