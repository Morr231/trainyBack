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

    const userDatas = UserDatesModel.findOne({
        _id: item.daysTextCount,
    });

    let daysStreak = null;

    userDatas.exec((err, allDatas) => {
        daysStreak = countDaysStreak({
            daysCount: allDatas.dates,
        });
    });

    const statObj = {
        daysStreak: daysStreak,
        fastestEssay:
            allTexts.length === 1
                ? item.texts[0]
                : allTexts[fastestEssay]["_id"],
        longestEssay:
            allTexts.length === 1
                ? item.texts[0]
                : allTexts[longestEssay]["_id"],
        averageWPM: averageWPM,
        averageTime: averageTime,
        averageWordCount: averageWordCount,
        dailyWordCount: everydayWords,
        dailyTime: everydayTime,
    };

    return statObj;
};

module.exports = getStatistics;
