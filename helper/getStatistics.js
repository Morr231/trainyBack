const { UserDatesModel } = require("../schemas/dateSchema");

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

const getStatistics = (allTexts, item) => {
    const fastestEssay = countFastestEssay({
        texts: allTexts,
    });
    const longestEssay = countLongestEssay({
        texts: allTexts,
    });

    const averageWPM = countAverageWPM({
        texts: allTexts,
    });
    const averageTime = countAverageTime({
        texts: allTexts,
    });
    const averageWordCount = countAverageWordCount({
        texts: allTexts,
    });

    const everydayWords = countEverydayWords({
        texts: allTexts,
    });
    const everydayTime = countEverydayTime({
        texts: allTexts,
    });

    const daysStreak = countDaysStreak({
        daysCount: item.daysTextCount.dates,
    });

    console.log(fastestEssay);
    console.log(longestEssay);

    const statObj = {
        daysStreak: daysStreak,
        fastestEssay: fastestEssay,
        longestEssay: longestEssay,
        averageWPM: averageWPM,
        averageTime: averageTime,
        averageWordCount: averageWordCount,
        dailyWordCount: everydayWords,
        dailyTime: everydayTime,
    };

    return statObj;
};

module.exports = getStatistics;
