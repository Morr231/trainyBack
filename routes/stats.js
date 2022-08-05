const { text } = require("body-parser");

const countFastestEssay = ({ texts }) => {
    let minFastestEssay = Infinity;

    console.log(texts);

    texts.forEach((el, index) => {
        if (el.timeSpend && el.timeSpend < minFastestEssay) {
            minFastestEssay = el.timeSpend;
        }
    });

    return minFastestEssay;
};

const countLongestEssay = ({ texts }) => {
    let maxLongestEssay = -1;

    texts.forEach((el, index) => {
        if (el.wordCount && el.wordCount > maxLongestEssay) {
            maxLongestEssay = el.wordCount;
        }
    });

    return maxLongestEssay;
};

const countAverageWPM = ({ texts }) => {
    let minutesSpend = 0;
    let textCount = 0;

    texts.forEach((el) => {
        if (el.wordCount && el.timeSpend) {
            minutesSpend += parseInt(el.timeSpend);
            textCount += parseInt(el.wordCount);
        }
    });

    return Math.floor((textCount / minutesSpend) * 60);
};

const countAverageTime = ({ texts }) => {
    let averageTime = 0;

    texts.forEach((el) => {
        if (el.timeSpend) {
            averageTime += el.timeSpend;
        }
    });

    return Math.floor(averageTime / text.length);
};

const countAverageWordCount = ({ texts }) => {
    let averageWords = 0;

    texts.forEach((el) => {
        if (el.wordCount) {
            averageWords += el.wordCount;
        }
    });

    return averageWords;
};

const dateConverter = (date) => {
    return `${date.getFullYear()}-${Math.floor((date.getMonth() + 1) / 10)}${
        Math.floor(date.getMonth() + 1) % 10
    }-${date.getDate()}`;
};

const countEverydayWords = ({ texts }) => {
    let everydayWords = [];

    texts.forEach((el) => {
        if (el.wordCount) {
            let dateIndex = -1;

            everydayWords.forEach((word, index) => {
                const elDate = dateConverter(el.date);

                const wordDate = dateConverter(word.date);

                if (elDate === wordDate) {
                    dateIndex = index;
                }
            });

            if (dateIndex === -1) {
                let tempWordObj = {};
                tempWordObj.date = el.date;
                tempWordObj.wordCount = el.wordCount;

                everydayWords.push(tempWordObj);
            } else {
                everydayWords[dateIndex].wordCount += el.wordCount;
            }
        }
    });
    return everydayWords;
};

const countEverydayTime = ({ texts }) => {
    let everydayTime = [];

    texts.forEach((el) => {
        if (el.timeSpend) {
            let dateIndex = -1;

            everydayTime.forEach((word, index) => {
                const elDate = dateConverter(el.date);

                const wordDate = dateConverter(word.date);

                if (elDate === wordDate) {
                    dateIndex = index;
                }
            });

            if (dateIndex === -1) {
                let tempWordObj = {};
                tempWordObj.date = el.date;
                tempWordObj.timeSpend = el.timeSpend;

                everydayTime.push(tempWordObj);
            } else {
                everydayTime[dateIndex].timeSpend += el.timeSpend;
            }
        }
    });

    return everydayTime;
};

const dateConverterNumber = ({ year, month, date }) => {
    const resultYear = parseInt(year) * 365;
    const resultMonth = parseInt(month) * 31;

    return resultYear + resultMonth + parseInt(date);
};

const countDaysStreak = ({ daysCount }) => {
    let maxDaysStreak = 0;
    let tempDaysStreak = 0;

    let prevDay = "";
    daysCount.forEach((el) => {
        // console.log(el);

        // console.log(dates[0], dates[1], dates[2]);
        if (prevDay) {
            let dates = el.date.split("-");
            let prevDaySplited = prevDay.split("-");

            let currentConvertedDate = dateConverterNumber({
                year: dates[0],
                month: dates[1],
                date: dates[2],
            });

            let prevConvertedDate = dateConverterNumber({
                year: prevDaySplited[0],
                month: prevDaySplited[1],
                date: prevDaySplited[2],
            });

            if (currentConvertedDate === prevConvertedDate + 1) {
                tempDaysStreak++;
            } else {
                if (tempDaysStreak > maxDaysStreak) {
                    maxDaysStreak = tempDaysStreak;
                }
                tempDaysStreak = 0;
            }
        } else {
            prevDay = el.date;
            tempDaysStreak++;
            maxDaysStreak++;
        }
    });
    if (tempDaysStreak > maxDaysStreak) {
        maxDaysStreak = tempDaysStreak;
    }

    return maxDaysStreak;
};

module.exports = {
    countFastestEssay,
    countLongestEssay,
    countAverageWPM,
    countAverageTime,
    countAverageWordCount,
    countEverydayWords,
    countEverydayTime,
    countDaysStreak,
};
