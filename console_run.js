//API section
const fetchUserInfo = async (token, refreshToken) => {
  try {
    const response = await fetch(
      "https://api-saakuru-gainz.beyondblitz.app/blitz/user/current-profile",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );
    const data = await response.json();
    return [token, refreshToken, data];
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      console.log("Token expired. Please get new token");
      return [token, refreshToken, null];
    } else {
      console.log(error);
      throw error; // Re-throw other errors
    }
  }
};

const fetchCurrentQuest = async (token) => {
  try {
    const response = await fetch(
      "https://api-saakuru-gainz.beyondblitz.app/blitz/quest/current-quest",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({ withQuestTask: true, withStatistic: true }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const fetchUserStatistic = async (token, questId) => {
  try {
    const response = await fetch(
      "https://api-saakuru-gainz.beyondblitz.app/blitz/quest/get-user-quest-statistic",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({ questId: questId }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const claimQuestTask = async (token, questId, taskId) => {
  try {
    const response = await fetch(
      "https://api-saakuru-gainz.beyondblitz.app/blitz/quest/claim-quest-task",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({ questId: questId, taskIds: [taskId] }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

//MAIN SECTION
async function runScript() {
  console.log("========================================");
  console.log("=          Saakaru Quest Bot           =");
  console.log("=         Created by Widiskel          =");
  console.log("========================================");
  console.log();
  console.log(`Processing ACCOUNT `);
  console.log();

  let token = user.token;
  let refreshToken = user.refreshToken;

  const [newToken, newRefreshToken, userInfo] = await fetchUserInfo(
    token,
    refreshToken
  );

  if (userInfo == null) {
    (token = newToken), (refreshToken = newRefreshToken);
  }
  console.log("========================================");
  console.log("Account information retrieved successfully");
  console.log(`ID               : ${userInfo.data.id}`);
  console.log(`Twitter ID       : ${userInfo.data.twitterId}`);
  console.log(`Twitter Handle   : ${userInfo.data.twitterHandle}`);
  console.log(`Name             : ${userInfo.data.name}`);

  const currentQuest = await fetchCurrentQuest(token);
  console.log("Curent Quest retrieved successfully");
  console.log(`QuestId          : ${currentQuest.data.id}`);
  console.log(`Quest Name       : ${currentQuest.data.name}`);
  console.log(`$SKR PRIZE POOL  : ${currentQuest.data.totalTokenPrize}`);
  const taskIds = currentQuest.data.tasks.map((task) => task.id);

  const userStatistic = await fetchUserStatistic(token, currentQuest.data.id);
  const completedTaskId = userStatistic.data.questTaskStatistic.map(
    (task) => task.questTaskId
  );
  const uncompletedTaskIds = taskIds.filter(
    (taskId) => !completedTaskId.includes(taskId)
  );

  console.log("User Quest Statistic retrieved successfully");
  let totalPoint = userStatistic.data.totalPoints;
  let multiplier = userStatistic.data.totalMultiplier;

  console.log(`Multiplier       : ${multiplier}x`);
  console.log(`Total Point      : ${totalPoint * multiplier} POINTS`);
  console.log(`Total Quest      : ${taskIds.length}`);
  console.log(`Completed Quest  : ${completedTaskId.length}`);
  console.log(`Uncomplete Quest : ${uncompletedTaskIds.length}`);

  console.log();
  console.log("========================================");
  console.log("============   DOING QUEST  ============");
  console.log("========================================");

  for (const taskId of uncompletedTaskIds) {
    const taskDetails = currentQuest.data.tasks.find((tsk) => tsk.id == taskId);

    // Log task details
    console.log();
    console.log(`-------------------- CLAIMING -------------------`);
    console.log(`Task ID: ${taskDetails.id}`);
    console.log(`Task Name: ${taskDetails.name}`);
    console.log(`Task Description: ${taskDetails.description}`);
    console.log(`-------------------------------------------------`);

    try {
      const claim = await claimQuestTask(token, currentQuest.data.id, taskId);
      console.log(`TASK ${taskDetails.id} CLAIMED`);
    } catch (error) {
      // Handle error if claimQuestTask fails
      failedLog(`Error claiming task ${taskId}`);
    }
    console.log(`-------------------------------------------------`);
  }
  console.log();
  console.log(`ACCOUNT Process complete`);
  console.log();
}

runScript();
