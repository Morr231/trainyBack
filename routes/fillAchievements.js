const { achievements } = require("../helper/achievements");

const fillAchievements = () => {
    return achievements.map((el) => {
        return {
            title: el.title,
            description: el.description,
            achievedTime: null,
            achieved: false,
            rank: el.rank,
        };
    });
};

module.exports = {
    fillAchievements,
};
