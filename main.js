const { successLog, failedLog, infoLog } = require("./logger");
const {
  getTokenList,
  fetchUserInfo,
  fetchUserStatistic,
  fetchCurrentQuest,
  claimQuestTask,
} = require("./api");
const colors = require("colors");

const main = async () => {
  try {
    const runCode = async () => {
      process.stdout.write("\x1Bc");
      console.log(colors.cyan("========================================"));
      console.log(colors.cyan("=          Saakaru Quest Bot           ="));
      console.log(colors.cyan("=         Created by Widiskel          ="));
      console.log(colors.cyan("========================================"));
      console.log();

      const tokenList = getTokenList();

      for (let i = 0; i < tokenList.length; i++) {
        console.log(
          colors.yellow(`Processing ACCOUNT ${i + 1} of ${tokenList.length}`)
        );
        console.log();

        let token = tokenList[i][0];
        let refreshToken = tokenList[i][1];

        const [newToken, newRefreshToken, userInfo] = await fetchUserInfo(
          token,
          refreshToken
        );
        if (userInfo == null) {
          (token = newToken), (refreshToken = newRefreshToken);
        }
        console.log(colors.cyan("========================================"));
        successLog("Account information retrieved successfully");
        infoLog(`ID               : ${userInfo.data.id}`);
        infoLog(`Twitter ID       : ${userInfo.data.twitterId}`);
        infoLog(`Twitter Handle   : ${userInfo.data.twitterHandle}`);
        infoLog(`Name             : ${userInfo.data.name}`);

        const currentQuest = await fetchCurrentQuest(token);
        successLog("Curent Quest retrieved successfully");
        infoLog(`QuestId          : ${currentQuest.data.id}`);
        infoLog(`Quest Name       : ${currentQuest.data.name}`);
        infoLog(`$SKR PRIZE POOL  : ${currentQuest.data.totalTokenPrize}`);
        const taskIds = currentQuest.data.tasks.map((task) => task.id);

        const userStatistic = await fetchUserStatistic(
          token,
          currentQuest.data.id
        );
        const completedTaskId = userStatistic.data.questTaskStatistic.map(
          (task) => task.questTaskId
        );
        const uncompletedTaskIds = taskIds.filter(
          (taskId) => !completedTaskId.includes(taskId)
        );

        successLog("User Quest Statistic retrieved successfully");
        let totalPoint = userStatistic.data.totalPoints;
        let multiplier = userStatistic.data.totalMultiplier;

        infoLog(`Multiplier       : ${multiplier}x`);
        infoLog(`Total Point      : ${totalPoint * multiplier} POINTS`);
        infoLog(`Total Quest      : ${taskIds.length}`);
        infoLog(`Completed Quest  : ${completedTaskId.length}`);
        infoLog(`Uncomplete Quest : ${uncompletedTaskIds.length}`);

        console.log();
        console.log(colors.cyan("========================================"));
        console.log(colors.cyan("============   DOING QUEST  ============"));
        console.log(colors.cyan("========================================"));

        for (const taskId of uncompletedTaskIds) {
          const taskDetails = currentQuest.data.tasks.find(
            (tsk) => tsk.id == taskId
          );

          // Log task details
          console.log();
          infoLog(`-------------------- CLAIMING -------------------`);
          infoLog(`Task ID: ${taskDetails.id}`);
          infoLog(`Task Name: ${taskDetails.name}`);
          infoLog(`Task Description: ${taskDetails.description}`);
          infoLog(`-------------------------------------------------`);

          try {
            const claim = await claimQuestTask(
              token,
              currentQuest.data.id,
              taskId
            );
            successLog(`TASK ${taskDetails.id} CLAIMED`);
          } catch (error) {
            // Handle error if claimQuestTask fails
            failedLog(`Error claiming task ${taskId}`);
          }
          infoLog(`-------------------------------------------------`);
        }
        console.log();
        console.log(colors.yellow(`ACCOUNT ${i + 1} Process complete`));
        console.log();
      }
    };

    await runCode();

    // 86400 seconds (1 day)
    setInterval(runCode, 3600 * 1000);
    console.log("Retrying in 1 hours......");
  } catch (error) {
    failedLog(error.message);
  }
};

module.exports = main;
