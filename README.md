<h1 align="center">🪟 English Janala</h1>

<p align="center">
A simple vocabulary learning app for Bengali speakers to explore English words — with meanings, pronunciations, examples, and synonyms.
</p>

<p align="center">
<a href="https://ratul-ai.github.io/English-Janala-WebApp/">🔗 Live Demo</a>
</p>

<p align="center">

![HTML](https://img.shields.io/badge/HTML-5-orange?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge)
![DaisyUI](https://img.shields.io/badge/DaisyUI-v5-purple?style=for-the-badge)

</p>

---

## ✨ Features

- Browse vocabulary by lesson levels  
- Search words across all lessons  
- View word details — meaning, example, and synonyms in a modal  
- Hear the word pronounced using the browser's Speech API  
- Save/unsave words and view them anytime in a saved list  
- Simple login flow with form validation  
- Loading spinners and error messages for a better experience  
- Fully responsive — works on mobile and desktop  

---

## 📚 What I learned & how I applied it here

This week I focused on three things — **DOM manipulation**, **API integration**, and **asynchronous data fetching** — and this project is where I put all of that into practice.

I connected to a real external API to load lesson levels, vocabulary words, and word details. Instead of hardcoding anything, all the content on the page is fetched and rendered dynamically using `fetch` and `async/await`. The lesson buttons, vocabulary cards, and even the modal content are all built from API responses at runtime.

For DOM manipulation, I used JavaScript to create and update elements on the fly — rendering cards, toggling classes, showing and hiding sections, and updating the UI without ever reloading the page. Things like the active lesson highlight, the login/logout flow, and the save button all update instantly based on what the user does.

I also learned the importance of not doing unnecessary work — so once the full word list is fetched for search, it gets cached in a state object and reused instead of re-fetching every time.

---

## ⚙️ Challenges I ran into

**Search showing all words on empty input** — took me a moment to realize that an empty string matches everything with `.includes()`. Fixed it with a simple early return.

**Keeping the save button in sync** — when a word is unsaved from the saved list, it should disappear from the list immediately. I had to track whether the user was viewing the saved list or a lesson, and re-render accordingly.

**Avoiding duplicate search results** — some words appeared across multiple lessons, so I had to deduplicate before showing search results.

---

## 🛠 Built with

HTML · Tailwind CSS v4 · DaisyUI v5 · Vanilla JavaScript · Font Awesome · Programming Hero Open API

---

## 👨‍💻 Author

**Ratul** — currently learning web development.  

[GitHub](https://github.com/Ratul-Ai) 