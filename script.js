/// Api urls
const api = {
  base: "https://openapi.programming-hero.com/api",
  levels: "https://openapi.programming-hero.com/api/levels/all",
  allWords: "https://openapi.programming-hero.com/api/words/all",
  level: (id) => `https://openapi.programming-hero.com/api/level/${id}`,
  word: (id) => `https://openapi.programming-hero.com/api/word/${id}`,
};

/// global variables
const state = {
  savedWords: [],
  isViewingSaved: false,
  allWords: null,
};

/// class hidden and show
const show = (id) => document.getElementById(id).classList.remove("hidden");
const hide = (id) => document.getElementById(id).classList.add("hidden");

//?                            Spinner
//! ─────────────────────────────────────────────────────────────

/// toggle-spinner
const toggleSpinner = (spinnerId, contentId, isLoading) => {
  if (isLoading) {
    show(spinnerId);
    hide(contentId);
  } else {
    hide(spinnerId);
    show(contentId);
  }
};

/// functions to call spinner
const setBtnLoading = (isLoading) =>
  toggleSpinner("spin1", "lesson-btns", isLoading);
const setCardLoading = (isLoading) =>
  toggleSpinner("spin2", "cards", isLoading);

/// modal spinner
const setModalLoading = (isLoading) => {
  toggleSpinner("modal-spinner", "details-box", isLoading);
  if (isLoading) {
    document.getElementById("details_modal").showModal();
  }
};

/// Error msg
const showError = (message) => {
  document.getElementById("error-text").innerText = message;
  show("error-msg");
};

const hideError = () => {
  hide("error-msg");
};

/// Empty state msg
const showEmptyState = (msg, hint) => {
  document.getElementById("cards").innerHTML = `
    <div class="space-y-4 col-span-full">
      <img class="mx-auto" src="./assets/alert-error.png" alt="No words found" />
      <p class="font-bangla text-black/60">${msg}</p>
      <h2 class="font-bangla text-3xl">${hint}</h2>
    </div>`;
  setCardLoading(false);
};

//?                      Data Loading
//! ─────────────────────────────────────────────────────────────

/// Data fetching
const fetchJSON = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const json = await response.json();
  return json.data;
};

/// load all words
const loadAllWords = async () => {
  if (state.allWords) return state.allWords;
  hideError();
  try {
    const data = await fetchJSON(api.allWords);
    state.allWords = data;
    return data;
  } catch (error) {
    showError("Something went wrong. Please try again.");
    console.error("Failed to load lessons:", error);
  }
};

/// load all lessons
const loadLessons = async () => {
  setBtnLoading(true);
  hideError();
  try {
    const lessons = await fetchJSON(api.levels);
    renderLessons(lessons);
  } catch (error) {
    showError("Something went wrong. Please try again.");
    console.error("Failed to load lessons:", error);
  } finally {
    setBtnLoading(false);
  }
};

/// load the level wise words
const loadWords = async (levelId) => {
  state.isViewingSaved = false;
  setCardLoading(true);
  hideError();
  try {
    const words = await fetchJSON(api.level(levelId));
    if (words.length === 0) {
      showEmptyState(
        "এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।",
        "নেক্সট Lesson এ যান",
      );
    } else {
      renderWords(words);
    }
  } catch (error) {
    showError("Something went wrong. Please try again.");
    console.error("Failed to load words:", error);
  }
};

/// load details
const loadDetails = async (wordId) => {
  setModalLoading(true);
  hideError();
  try {
    const details = await fetchJSON(api.word(wordId));
    renderDetails(details);
  } catch (error) {
    showError("Something went wrong. Please try again.");
    console.error("Failed to load word details:", error);
  }
};

//?                       Data Displaying
//! ─────────────────────────────────────────────────────────────

/// displaying lessons on UI
const renderLessons = (lessons) => {
  const container = document.getElementById("lesson-btns");

  container.innerHTML = lessons
    .map(
      (lesson) => `
      <button
        id="lesson-${lesson.id}"
        onclick="loadWords(${lesson.level_no}); highlight('lesson-${lesson.id}')"
        class="change btn btn-outline btn-primary"
      >
        <i class="fa-solid fa-book-open"></i> Lesson-${lesson.level_no}
      </button>`,
    )
    .join("");
};

/// displaying cards on UI
const renderWords = (words) => {
  const container = document.getElementById("cards");

  container.innerHTML = words
    .map((word) => {
      const isSaved = state.savedWords.some((w) => w.id === word.id);
      return `
        <div class="flex flex-col h-full items-center text-center py-10 px-8 space-y-3 bg-gray-50 rounded-lg shadow-sm">
          <h2 class="text-black text-2xl font-semibold">${word.word || "word পাওয়া যায়নি"}</h2>
          <p class="text-black text-sm">Meaning / Pronunciation</p>
          <h2 class="text-black font-bangla text-2xl font-semibold">
            ${word.meaning || "অর্থ পাওয়া যায়নি"} /
            ${word.pronunciation || "pronunciation পাওয়া যায়নি"}
          </h2>
          <div class="mt-auto flex justify-between items-center w-full pt-6">
            <div class="space-x-2">
              <button onclick="loadDetails(${word.id})" class="btn btn-xs btn-square btn-info">
                <i class="fa-solid fa-circle-info"></i>
              </button>
              <button onclick="pronounceWord('${word.word}')" class="btn btn-xs btn-square btn-info">
                <i class="fa-solid fa-volume-high"></i>
              </button>
            </div>
            <button
              id="save-btn-${word.id}"
              onclick="toggleSaveWord(${word.id})"
              class="btn btn-xs btn-circle btn-error ${isSaved ? "" : "btn-outline"}"
            >
              <i class="${isSaved ? "fa-solid" : "fa-regular"} fa-heart"></i>
            </button>
          </div>
        </div>`;
    })
    .join("");

  setCardLoading(false);
};

/// show modal details in UI
const renderDetails = (details) => {
  const box = document.getElementById("details-box");
  box.innerHTML = `
    <div>
      <h3 class="text-2xl font-bold">
        ${details.word || "Word not Found"}
        (<i class="fa-solid fa-microphone-lines"></i> : ${details.pronunciation || "pronunciation পাওয়া যায়নি"})
      </h3>
    </div>
    <div class="space-y-1">
      <p class="text-xl font-semibold">Meaning</p>
      <p class="text-xl">${details.meaning || "অর্থ পাওয়া যায়নি"}</p>
    </div>
    <div class="space-y-1">
      <p class="text-xl font-semibold">Example</p>
      <p class="text-xl">${details.sentence || "Example পাওয়া যায়নি"}</p>
    </div>
    <div class="space-y-2">
      <p class="text-xl font-semibold">সমার্থক শব্দ গুলো</p>
      <div class="space-x-1">${renderSynonyms(details.synonyms)}</div>
    </div>`;

  setModalLoading(false);

  document.getElementById("details_modal").showModal();
};

/// get synonyms
const renderSynonyms = (synonyms) => {
  if (!synonyms || synonyms.length === 0) {
    return `<p class="text-xl">সমার্থক শব্দ পাওয়া যায়নি</p>`;
  }
  return synonyms
    .map((word) => `<span class="btn bg-blue-50">${word}</span>`)
    .join(" ");
};

/// save words
const toggleSaveWord = async (wordId) => {
  const allWords = await loadAllWords();
  const word = allWords.find((w) => w.id === wordId);

  const existingIndex = state.savedWords.findIndex((w) => w.id === wordId);
  const btn = document.getElementById(`save-btn-${wordId}`);

  if (existingIndex !== -1) {
    state.savedWords.splice(existingIndex, 1);
    btn.classList.add("btn-outline");
    btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
    if (state.isViewingSaved) {
      if (state.savedWords.length === 0) {
        showEmptyState(
          "আপনি এখনো কোন শব্দ সংরক্ষণ করেননি।",
          "নতুন শব্দ যোগ করতে শব্দের পাশে Save বাটনে ক্লিক করুন",
        );
      } else {
        renderWords(state.savedWords);
      }
    }
  } else {
    state.savedWords.unshift(word);
    btn.classList.remove("btn-outline");
    btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
  }
};

/// Highlight the active buttons.
const highlight = (buttonId) => {
  document.querySelectorAll(".change").forEach((btn) => {
    btn.classList.add("btn-outline");
  });
  document.getElementById(buttonId)?.classList.remove("btn-outline");
};

/// Text-to-speech.
const pronounceWord = (word) => {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
};

//?                     EVENT LISTENERS
//! ─────────────────────────────────────────────────────────────

/// Search button click
document.getElementById("btn-search").addEventListener("click", async () => {
  state.isViewingSaved = false;

  const input = document
    .getElementById("search-input")
    .value.trim()
    .toLowerCase();
  if (!input) return;

  const allWords = await loadAllWords();

  const uniqueWords = allWords.filter(
    (word, index, self) =>
      index ===
      self.findIndex((w) => w.word.toLowerCase() === word.word.toLowerCase()),
  );

  const filtered = uniqueWords.filter((word) =>
    word.word.toLowerCase().includes(input),
  );

  if (filtered.length === 0) {
    showEmptyState(
      "আপনার সার্চের সাথে কোন শব্দ মেলেনি।",
      "অন্য কোন শব্দ দিয়ে আবার চেষ্টা করুন",
    );
  } else {
    renderWords(filtered);
  }
});

/// Saved words button click
document.getElementById("saved").addEventListener("click", () => {
  state.isViewingSaved = true;
  if (state.savedWords.length === 0) {
    showEmptyState(
      "আপনি এখনো কোন শব্দ সংরক্ষণ করেননি।",
      "নতুন শব্দ যোগ করতে শব্দের পাশে Save বাটনে ক্লিক করুন",
      
    );
  } else {
    renderWords(state.savedWords);
  }
});

/// login btns
document.querySelectorAll(".login-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    highlight("log-in-btn");
    e.preventDefault();
    document.getElementById("username").focus();
  });
});

/// logout btns
document.querySelectorAll(".logout-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll(".nav-user").forEach((user) => {
      user.classList.add("hidden");
    });
    document.querySelectorAll(".logout-btn").forEach((btn) => {
      btn.classList.add("hidden");
    });
    document.querySelectorAll(".login-btn").forEach((btn) => {
      btn.classList.remove("hidden");
    });
    show("login-form");
    hide("login-msg");
  });
});

/// submit btn
document.getElementById("submit-btn").addEventListener("click", (e) => {
  e.preventDefault();
  const userName = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!userName || !password) {
    show("form-error");
    return;
  }

  hide("form-error");

  document.querySelectorAll(".user").forEach((user) => {
    user.innerText = userName;
  });
  document.querySelectorAll(".nav-user").forEach((user) => {
    user.classList.remove("hidden");
  });
  document.querySelectorAll(".logout-btn").forEach((btn) => {
    btn.classList.remove("hidden");
  });
  document.querySelectorAll(".login-btn").forEach((btn) => {
    btn.classList.add("hidden");
  });
  document.getElementById("login-form").reset();
  document.getElementById("log-in-btn").classList.add("btn-outline");
  hide("login-form");
  show("login-msg");
});

//* start the page
loadLessons();