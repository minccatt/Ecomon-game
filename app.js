// 에코몬 성장 게임
// MISSION.md를 읽고 TODO 부분을 완성하세요.
//
// 주의:
// 에코 점수는 실제 탄소 감축량이 아니라 수업용 게임 점수입니다.

const goalScore = 100;

/**
 * 에코몬의 진화 단계입니다.
 *
 * minScore:
 * 해당 단계가 시작되는 최소 점수
 */
const stages = [
  {
    minScore: 0,
    name: "잠든 에코몬 알",
    emoji: "🥚",
    label: "1단계",
    message: "환경 실천으로 에너지를 모아 알을 깨워 주세요."
  },
  {
    minScore: 20,
    name: "새싹 에코몬",
    emoji: "🌱",
    label: "2단계",
    message: "작은 새싹이 세상 밖으로 나왔어요!"
  },
  {
    minScore: 40,
    name: "초록 에코몬",
    emoji: "🌿",
    label: "3단계",
    message: "초록 잎이 풍성하게 자라고 있어요."
  },
  {
    minScore: 70,
    name: "나무 에코몬",
    emoji: "🌳",
    label: "4단계",
    message: "건강한 나무 에코몬으로 성장했어요!"
  },
  {
    minScore: 100,
    name: "지구 수호 에코몬",
    emoji: "🌍",
    label: "최종 단계",
    message: "축하합니다! 지구 수호 에코몬이 탄생했어요!"
  }
];

// HTML 요소 가져오기
const actionButtons = document.querySelectorAll(".action-button");
const missionButton = document.querySelector("#mission-button");
const resetButton = document.querySelector("#reset-button");

const ecomonEmoji = document.querySelector("#ecomon-emoji");
const ecomonName = document.querySelector("#ecomon-name");
const ecomonMessage = document.querySelector("#ecomon-message");
const stageBadge = document.querySelector("#stage-badge");

const ecoScoreElement = document.querySelector("#eco-score");
const goalScoreElement = document.querySelector("#goal-score");
const actionCountElement = document.querySelector("#action-count");
const evolutionCountElement =
  document.querySelector("#evolution-count");

const progressTrack = document.querySelector("#progress-track");
const progressBar = document.querySelector("#progress-bar");
const nextStageMessage =
  document.querySelector("#next-stage-message");

const statusMessage = document.querySelector("#status-message");
const missionText = document.querySelector("#mission-text");
const recordList = document.querySelector("#record-list");

// 현재 게임 상태
let ecoScore = 0;
let actionCount = 0;
let records = [];

/**
 * 현재 점수에 맞는 에코몬 단계 번호를 반환합니다.
 */
function getCurrentStageIndex() {
  let currentStageIndex = 0;

  stages.forEach(function (stage, index) {
    if (ecoScore >= stage.minScore) {
      currentStageIndex = index;
    }
  });

  return currentStageIndex;
}

/**
 * 다음 진화 단계 안내 문장을 만듭니다.
 */
function getNextStageMessage(currentStageIndex) {
  const isFinalStage =
    currentStageIndex === stages.length - 1;

  if (isFinalStage) {
    return "최종 진화 완료! 지구 수호 에코몬이 되었습니다.";
  }

  const nextStage = stages[currentStageIndex + 1];
  const remainingScore = nextStage.minScore - ecoScore;

  return `${nextStage.name}까지 ${remainingScore}점 남았습니다.`;
}

/**
 * 현재 게임 상태를 화면에 표시합니다.
 */
function render() {
  const currentStageIndex = getCurrentStageIndex();
  const currentStage = stages[currentStageIndex];

  ecoScoreElement.textContent = ecoScore;
  goalScoreElement.textContent = goalScore;
  actionCountElement.textContent = actionCount;
  evolutionCountElement.textContent = currentStageIndex;

  ecomonEmoji.textContent = currentStage.emoji;
  ecomonEmoji.setAttribute(
    "aria-label",
    `${currentStage.name} 모습`
  );

  ecomonName.textContent = currentStage.name;
  ecomonMessage.textContent = currentStage.message;
  stageBadge.textContent = currentStage.label;

  const progressPercent = Math.min(
    (ecoScore / goalScore) * 100,
    100
  );

  progressBar.style.width = `${progressPercent}%`;

  progressTrack.setAttribute(
    "aria-valuenow",
    Math.min(ecoScore, goalScore)
  );

  nextStageMessage.textContent =
    getNextStageMessage(currentStageIndex);

  renderRecords();
}

/**
 * 실천 기록 목록을 화면에 표시합니다.
 */
function renderRecords() {
  if (records.length === 0) {
    recordList.innerHTML =
      '<li class="empty-record">아직 실천 기록이 없습니다.</li>';
    return;
  }

  recordList.innerHTML = "";

  records.forEach(function (record) {
    const listItem = document.createElement("li");

    const actionText = document.createElement("span");
    actionText.textContent = record.action;

    const pointText = document.createElement("span");
    pointText.className = "record-points";
    pointText.textContent = `+${record.points}점`;

    listItem.appendChild(actionText);
    listItem.appendChild(pointText);

    recordList.appendChild(listItem);
  });
}

/**
 * 에코몬이 점프하는 애니메이션을 실행합니다.
 */
function playBounceAnimation() {
  ecomonEmoji.classList.remove("bounce");

  // 같은 애니메이션을 다시 실행할 수 있도록
  // 브라우저가 변경사항을 먼저 계산하게 합니다.
  void ecomonEmoji.offsetWidth;

  ecomonEmoji.classList.add("bounce");
}

/**
 * 에코몬 진화 애니메이션을 실행합니다.
 */
function playEvolutionAnimation() {
  ecomonEmoji.classList.remove("evolve");
  void ecomonEmoji.offsetWidth;
  ecomonEmoji.classList.add("evolve");
}

/**
 * 환경 실천 버튼 기능
 *
 * TODO:
 * 각 환경 행동 버튼을 눌렀을 때 다음 기능을 구현하세요.
 *
 * 1. 누른 버튼의 data-action 값을 가져옵니다.
 * 2. 누른 버튼의 data-points 값을 숫자로 가져옵니다.
 * 3. 행동 전 에코몬 단계 번호를 저장합니다.
 * 4. ecoScore에 점수를 더합니다.
 * 5. actionCount를 1 증가시킵니다.
 * 6. records 배열의 맨 앞에 행동과 점수를 추가합니다.
 * 7. render()를 실행합니다.
 * 8. 완료 안내 문구를 보여 줍니다.
 * 9. 단계가 바뀌면 진화 애니메이션을 실행합니다.
 * 10. 단계가 바뀌지 않으면 점프 애니메이션을 실행합니다.
 */
actionButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    statusMessage.textContent =
      "아직 환경 실천 기능이 완성되지 않았습니다. MISSION.md를 확인하세요.";

    // TODO: 이 부분에 환경 실천 기능을 작성하세요.
  });
});

/**
 * 무작위 추천 미션을 뽑습니다.
 */
missionButton.addEventListener("click", function () {
  actionButtons.forEach(function (button) {
    button.classList.remove("recommended");
  });

  const randomIndex = Math.floor(
    Math.random() * actionButtons.length
  );

  const selectedButton = actionButtons[randomIndex];
  const action = selectedButton.dataset.action;
  const points = Number(selectedButton.dataset.points);

  selectedButton.classList.add("recommended");

  missionText.textContent =
    `오늘의 추천 미션: ${action} (+${points}점)`;
});

/**
 * 게임을 처음 상태로 되돌립니다.
 */
resetButton.addEventListener("click", function () {
  const shouldReset = window.confirm(
    "에코 점수와 실천 기록을 모두 초기화할까요?"
  );

  if (!shouldReset) {
    return;
  }

  ecoScore = 0;
  actionCount = 0;
  records = [];

  actionButtons.forEach(function (button) {
    button.classList.remove("recommended");
  });

  missionText.textContent =
    "어떤 행동을 할지 고민된다면 미션을 받아 보세요.";

  statusMessage.textContent =
    "게임을 처음 상태로 초기화했습니다.";

  render();
});

/**
 * 페이지를 처음 열었을 때 화면을 표시합니다.
 */
render();