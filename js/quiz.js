(function () {
  window.dataLayer = window.dataLayer || [];

  function push(obj) {
    window.dataLayer.push(obj);
  }

  function readAnswers() {
    try {
      return JSON.parse(localStorage.getItem("bm_answers") || "{}");
    } catch (e) {
      return {};
    }
  }

  function saveAnswer(question, answer) {
    try {
      var answers = readAnswers();
      answers[question] = answer;
      localStorage.setItem("bm_answers", JSON.stringify(answers));
    } catch (e) {
      window.__bmAnswers = window.__bmAnswers || {};
      window.__bmAnswers[question] = answer;
    }
  }

  function showSavedAnswer(questionKey) {
    var answers = readAnswers();
    var savedAnswer = answers[questionKey];
    if (!savedAnswer) return;
    var selected = document.querySelector('[data-value="' + savedAnswer + '"]');
    var continueButton = document.querySelector(".btn-continue");
    if (selected) selected.classList.add("selected");
    if (continueButton) continueButton.classList.add("visible");
  }

  function setupQuiz() {
    if (typeof CURRENT_QUESTION === "undefined") return;

    var questionKey = "q" + CURRENT_QUESTION;
    var continueButton = document.querySelector(".btn-continue");
    var stepCompleted = false;

    showSavedAnswer(questionKey);

    document.querySelectorAll(".option").forEach(function (option) {
      option.addEventListener("click", function () {
        document.querySelectorAll(".option").forEach(function (item) {
          item.classList.remove("selected");
        });
        option.classList.add("selected");
        if (continueButton) continueButton.classList.add("visible");
        saveAnswer(questionKey, option.dataset.value);

        push({
          event: "quiz_option_selected",
          quiz_step: CURRENT_QUESTION,
          quiz_question: questionKey,
          quiz_answer: option.dataset.value,
          answer_text: option.textContent.trim().replace(/^[A-D]\s*/, "")
        });
      });
    });

    if (continueButton) {
      continueButton.addEventListener("click", function () {
        stepCompleted = true;
        push({
          event: "quiz_step_completed",
          quiz_step: CURRENT_QUESTION,
          quiz_question: questionKey
        });
      });
    }

    // Track funnel drop-off: fires if user leaves without completing the step
    window.addEventListener("pagehide", function () {
      if (!stepCompleted) {
        push({
          event: "funnel_abandoned",
          abandoned_at_step: CURRENT_QUESTION,
          abandoned_at_question: questionKey
        });
      }
    });
  }

  document.addEventListener("DOMContentLoaded", setupQuiz);
})();
