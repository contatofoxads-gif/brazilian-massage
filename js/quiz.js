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
    if (selected) selected.classList.add("selected");
  }

  function setupQuiz() {
    if (typeof CURRENT_QUESTION === "undefined") return;

    var questionKey = "q" + CURRENT_QUESTION;
    var nextPage = typeof NEXT_PAGE !== "undefined" ? NEXT_PAGE : null;
    var stepCompleted = false;

    showSavedAnswer(questionKey);

    document.querySelectorAll(".option").forEach(function (option) {
      option.addEventListener("click", function () {
        if (stepCompleted) return;

        document.querySelectorAll(".option").forEach(function (item) {
          item.classList.remove("selected");
        });
        option.classList.add("selected");
        saveAnswer(questionKey, option.dataset.value);

        push({
          event: "quiz_option_selected",
          quiz_step: CURRENT_QUESTION,
          quiz_question: questionKey,
          quiz_answer: option.dataset.value,
          answer_text: option.textContent.trim().replace(/^[A-D]\s*/, "")
        });

        if (nextPage) {
          stepCompleted = true;
          setTimeout(function () {
            push({
              event: "quiz_step_completed",
              quiz_step: CURRENT_QUESTION,
              quiz_question: questionKey
            });
            window.location.href = nextPage;
          }, 500);
        }
      });
    });

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
