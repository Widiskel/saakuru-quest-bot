const axios = require("axios");
const fs = require("fs");

const fetchUserInfo = async (token, refreshToken) => {
  try {
    const response = await axios.post(
      "https://api-saakuru-gainz.beyondblitz.app/blitz/user/current-profile",
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
          accept: "application/json",
          "content-type": "application/json",
        },
      }
    );
    return [token, refreshToken, response.data];
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      console.log("Token expired. Refreshing token...");
      const refreshedTokenData = await refreshUserToken(refreshToken);
      return [token, refreshToken, null];
    } else {
      console.log(error);
      throw error; // Re-throw other errors
    }
  }
};

const fetchCurrentQuest = async (token) => {
  try {
    const response = await axios.post(
      "https://api-saakuru-gainz.beyondblitz.app/blitz/quest/current-quest",
      { withQuestTask: true, withStatistic: true },
      {
        headers: {
          Authorization: "Bearer " + token,
          accept: "application/json",
          "content-type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const refreshUserToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      "https://api-saakuru-gainz.beyondblitz.app/blitz/auth/refresh-token",
      {
        refreshToken: refreshToken,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
      }
    );

    // Update token in account.js
    if (response.data.data == null) {
      console.log("Token expired, go get your new token");
      throw Error("Token expired");
    }
    const tokenData = response.data.data;
    const accounts = require("./accounts.js");
    const updatedAccounts = accounts.map((tkn) => {
      console.log(tkn);
      if (tkn[0] == "a") {
        return [tokenData.token, tokenData.refreshToken];
      }
      return tkn;
    });

    fs.writeFileSync(
      "./accounts.js",
      `module.exports = ${JSON.stringify(updatedAccounts, null, 2)};\n`
    );

    return [tokenData.token, tokenData.refreshToken];
  } catch (error) {
    console.log(error);
  }
};

const fetchUserStatistic = async (token, questId) => {
  try {
    const response = await axios.post(
      "https://api-saakuru-gainz.beyondblitz.app/blitz/quest/get-user-quest-statistic",
      { questId: questId },
      {
        headers: {
          Authorization: "Bearer " + token,
          accept: "application/json",
          "content-type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const claimQuestTask = async (token, questId, taskId) => {
  try {
    const response = await axios.post(
      "https://api-saakuru-gainz.beyondblitz.app/blitz/quest/claim-quest-task",
      { questId: questId, taskIds: [taskId] },
      {
        headers: {
          Authorization: "Bearer " + token,
          accept: "application/json",
          "content-type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getTokenList = () => {
  const accounts = require("./accounts.js");
  return accounts;
};

module.exports = {
  fetchUserInfo,
  getTokenList,
  fetchUserStatistic,
  fetchCurrentQuest,
  refreshUserToken,
  claimQuestTask,
};
