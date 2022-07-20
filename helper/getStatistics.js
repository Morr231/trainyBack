const {
    countFastestEssay,
    countLongestEssay,
    countAverageWPM,
    countAverageTime,
    countAverageWordCount,
    countEverydayWords,
    countEverydayTime,
    countDaysStreak,
} = require("../routes/stats");

const getStatistics = (found, item) => {
    const fastestEssay = countFastestEssay({
        texts: item.texts,
    });
    const longestEssay = countLongestEssay({
        texts: item.texts,
    });

    const averageWPM = countAverageWPM({
        texts: item.texts,
    });
    const averageTime = countAverageTime({
        texts: item.texts,
    });
    const averageWordCount = countAverageWordCount({
        texts: item.texts,
    });

    const everydayWords = countEverydayWords({
        texts: item.texts,
    });
    const everydayTime = countEverydayTime({
        texts: item.texts,
    });

    const daysStreak = countDaysStreak({
        daysCount: item.daysTextCount,
    });

    const statObj = {
        daysStreak: daysStreak,
        fastestEssay: found.texts[fastestEssay],
        longestEssay: found.texts[longestEssay],
        averageWPM: averageWPM,
        averageTime: averageTime,
        averageWordCount: averageWordCount,
        dailyWordCount: everydayWords,
        dailyTime: everydayTime,
    };

    return statObj;
};

module.exports = getStatistics;
