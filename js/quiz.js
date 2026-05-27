(function () {
  window.dataLayer = window.dataLayer || [];

  function push(obj) {
    window.dataLayer.push(obj);
  }

  function saveAnswer(question, answer) {
    try {
      var answers = JSON.parse(localStorage.getItem("bm_answers") || "{}");
      answers[question] = answer;
      localStorage.setItem("bm_answers", JSON.stringify(answers));
    } catch (e) {}
  }

  function setupQuiz() {
    if (typeof CURRENT_QUESTION === "undefined") return;
    var questionKey = "q" + CURRENT_QUESTION;
    var clicked = false;

    document.querySelectorAll(".option").forEach(function (option) {
      option.addEventListener("click", function () {
        if (clicked) return;
        clicked = true;
        document.querySelectorAll(".option").forEach(function (o) {
          o.classList.remove("selected");
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
        push({
          event: "quiz_step_completed",
          quiz_step: CURRENT_QUESTION,
          quiz_question: questionKey
        });
      });
    });

    window.addEventListener("pagehide", function () {
      if (!clicked) {
        push({
          event: "funnel_abandoned",
          abandoned_at_step: CURRENT_QUESTION,
          abandoned_at_question: questionKey
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupQuiz);
  } else {
    setupQuiz();
  }
})();
