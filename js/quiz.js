(function () {
  function readAnswers() {
    try {
      return JSON.parse(localStorage.getItem("bm_answers") || "{}");
    } catch (error) {
      return {};
    }
  }

  function saveAnswer(question, answer) {
    try {
      const answers = readAnswers();
      answers[question] = answer;
      localStorage.setItem("bm_answers", JSON.stringify(answers));
    } catch (error) {
      window.__bmAnswers = window.__bmAnswers || {};
      window.__bmAnswers[question] = answer;
    }
  }

  function showSavedAnswer(questionKey) {
    const answers = readAnswers();
    const savedAnswer = answers[questionKey];
    if (!savedAnswer) return;

    const selected = document.querySelector('[data-value="' + savedAnswer + '"]');
    const continueButton = document.querySelector(".btn-continue");

    if (selected) selected.classList.add("selected");
    if (continueButton) continueButton.classList.add("visible");
  }

  function setupQuiz() {
    if (typeof CURRENT_QUESTION === "undefined") return;

    const questionKey = "q" + CURRENT_QUESTION;
    const continueButton = document.querySelector(".btn-continue");

    showSavedAnswer(questionKey);

    document.querySelectorAll(".option").forEach(function (option) {
      option.addEventListener("click", function () {
        document.querySelectorAll(".option").forEach(function (item) {
          item.classList.remove("selected");
        });

        option.classList.add("selected");
        if (continueButton) continueButton.classList.add("visible");
        saveAnswer(questionKey, option.dataset.value);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", setupQuiz);
})();
