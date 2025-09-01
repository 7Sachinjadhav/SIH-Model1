// Progress store in localStorage
const DEFAULT_PROGRESS = {
  regions: {
    north: { completed: 0 }, // number of places unlocked/cleared (0..10)
    south: { completed: 0 },
    east:  { completed: 0 },
    west:  { completed: 0 }
  },
  rewardClaimable: false
};

function loadProgress() {
  const raw = localStorage.getItem('tti_progress');
  if (!raw) return JSON.parse(JSON.stringify(DEFAULT_PROGRESS));
  try {
    const data = JSON.parse(raw);
    // ensure keys
    return Object.assign({}, DEFAULT_PROGRESS, data, {
      regions: Object.assign({}, DEFAULT_PROGRESS.regions, data.regions || {})
    });
  } catch(e) {
    return JSON.parse(JSON.stringify(DEFAULT_PROGRESS));
  }
}

function saveProgress(p) {
  localStorage.setItem('tti_progress', JSON.stringify(p));
}

// -------------------- REGION DATA --------------------
window.RegionData = {
  places: [
    {
      title: "Taj Mahal",
      subtitle: "Agra, Uttar Pradesh",
      image: "images/tajmahal.jpg",
      video: "https://www.youtube.com/embed/your-taj-video-id",
      quiz: [
        { question: "In which city is the Taj Mahal located?", options: ["Delhi", "Agra", "Jaipur", "Lucknow"], answerIndex: 1 },
        { question: "Who built the Taj Mahal?", options: ["Shah Jahan", "Akbar", "Aurangzeb", "Humayun"], answerIndex: 0 },
        { question: "The Taj Mahal was built in memory of whom?", options: ["Mumtaz Mahal", "Noor Jahan", "Jodha Bai", "Begum Akbar"], answerIndex: 0 },
        { question: "What is the main material used in Taj Mahal?", options: ["Red sandstone", "Marble", "Granite", "Limestone"], answerIndex: 1 },
        { question: "Which river flows beside the Taj Mahal?", options: ["Ganga", "Yamuna", "Godavari", "Sutlej"], answerIndex: 1 },
        { question: "When was the Taj Mahal completed?", options: ["1653", "1648", "1700", "1620"], answerIndex: 0 },
        { question: "What is the Taj Mahal famous for?", options: ["Gardens", "White marble", "Architecture", "All of the above"], answerIndex: 3 },
        { question: "Which UNESCO title does the Taj Mahal have?", options: ["World Heritage Site", "Wonder of Asia", "Royal Monument", "Heritage of India"], answerIndex: 0 },
        { question: "How many minarets does the Taj Mahal have?", options: ["2", "3", "4", "5"], answerIndex: 2 },
        { question: "What color does the Taj Mahal appear at sunrise?", options: ["White", "Pinkish", "Golden", "Blue"], answerIndex: 1 }
      ]
    },
    {
      title: "Red Fort",
      subtitle: "Delhi",
      image: "images/redfort.jpg",
      video: "https://www.youtube.com/embed/your-redfort-video-id",
      quiz: [
        { question: "In which city is the Red Fort located?", options: ["Delhi", "Agra", "Lucknow", "Varanasi"], answerIndex: 0 },
        { question: "Who built the Red Fort?", options: ["Shah Jahan", "Akbar", "Aurangzeb", "Bahadur Shah Zafar"], answerIndex: 0 },
        { question: "What is the main building material of the Red Fort?", options: ["Red sandstone", "Marble", "Granite", "Limestone"], answerIndex: 0 },
        { question: "In which year was the Red Fort completed?", options: ["1648", "1639", "1658", "1620"], answerIndex: 0 },
        { question: "Which famous speech is delivered every Independence Day from the Red Fort?", options: ["Republic Day Speech", "Prime Minister's Speech", "Independence Day Speech", "National Anthem"], answerIndex: 2 },
        { question: "Which UNESCO title does the Red Fort have?", options: ["World Heritage Site", "National Treasure", "Historic Monument", "Heritage of Delhi"], answerIndex: 0 },
        { question: "Which Mughal emperor moved his capital to Delhi and built the Red Fort?", options: ["Shah Jahan", "Akbar", "Aurangzeb", "Jahangir"], answerIndex: 0 },
        { question: "What is the Hindi name of the Red Fort?", options: ["Lal Qila", "Lal Mahal", "Lal Durg", "Lal Haveli"], answerIndex: 0 },
        { question: "Which river once flowed beside the Red Fort?", options: ["Yamuna", "Ganga", "Sutlej", "Indus"], answerIndex: 0 },
        { question: "Which architectural style is seen in the Red Fort?", options: ["Mughal", "Rajput", "British", "Persian"], answerIndex: 0 }
      ]
    },
    // The rest of the 8 places (kept with empty quiz arrays for now)
    { title: "Qutub Minar", image: "images/qutubminar.jpg", video: "#", quiz: [] },
    { title: "India Gate", image: "images/indiagate.jpg", video: "#", quiz: [] },
    { title: "Lotus Temple", image: "images/lotustemple.jpg", video: "#", quiz: [] },
    { title: "Golden Temple", image: "images/goldentemple.jpg", video: "#", quiz: [] },
    { title: "Hawa Mahal", image: "images/hawamahal.jpg", video: "#", quiz: [] },
    { title: "Mysore Palace", image: "images/mysorepalace.jpg", video: "#", quiz: [] },
    { title: "Charminar", image: "images/charminar.jpg", video: "#", quiz: [] },
    { title: "Gateway of India", image: "images/gatewayofindia.jpg", video: "#", quiz: [] }
  ]
};

// -------------------- INDEX PAGE SETUP --------------------
document.addEventListener('DOMContentLoaded', () => {
  const p = loadProgress();
  const btnSouth = document.getElementById('btn-south');
  const btnEast  = document.getElementById('btn-east');
  const btnWest  = document.getElementById('btn-west');
  const rewardBtn = document.getElementById('rewardBtn');

  if (btnSouth && p.regions.north.completed >= 10) {
    btnSouth.textContent = 'Enter'; btnSouth.classList.remove('locked'); btnSouth.disabled = false;
    btnSouth.onclick = () => goToRegion('south');
  }
  if (btnEast && p.regions.south.completed >= 10) {
    btnEast.textContent = 'Enter'; btnEast.classList.remove('locked'); btnEast.disabled = false;
    btnEast.onclick = () => goToRegion('east');
  }
  if (btnWest && p.regions.east.completed >= 10) {
    btnWest.textContent = 'Enter'; btnWest.classList.remove('locked'); btnWest.disabled = false;
    btnWest.onclick = () => goToRegion('west');
  }

  // Reward unlock when all four boards completed
  if (rewardBtn) {
    const allDone = ['north','south','east','west'].every(r => p.regions[r].completed >= 10);
    rewardBtn.disabled = !allDone;
  }

  // Region page rendering
  const container = document.getElementById('placesContainer');
  if (container) {
    const region = container.dataset.region;
    if (!window.RegionData) {
      container.innerHTML = '<p class="lock-note">Data not loaded.</p>';
      return;
    }
    const pRegion = loadProgress().regions[region];
    const arr = window.RegionData.places;

    container.innerHTML = '';
    arr.forEach((place, idx) => {
      const unlocked = idx === 0 || pRegion.completed > idx-1; // first is open, next needs previous cleared
    });
  }
});

function goToRegion(region) {
  window.location.href = `regions/${region}.html`;
}

function goReward() {
  window.location.href = 'reward.html';
}

// ----- Quiz Modal APIs -----
let CURRENT_REGION = null;
let CURRENT_PLACE_INDEX = null;
let CURRENT_QUESTIONS = null;

function openQuiz(region, placeIndex) {
  CURRENT_REGION = region;
  CURRENT_PLACE_INDEX = placeIndex;
  const modal = document.getElementById('quizModal');
  const form = document.getElementById('quizForm');
  const data = window.RegionData;
  const questions = data.places[placeIndex].quiz;
  CURRENT_QUESTIONS = questions;

  form.innerHTML = '';
  questions.forEach((q, i) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'q';
    qDiv.innerHTML = `<h4>Q${i+1}. ${q.question}</h4>` + q.options.map((opt, oi) => {
      const id = `q${i}_o${oi}`;
      return `<label><input type="radio" name="q${i}" value="${oi}" required> ${opt}</label><br/>`;
    }).join('');
    form.appendChild(qDiv);
  });

  modal.classList.remove('hidden');
  modal.scrollTop = 0;
}

function closeQuiz() {
  document.getElementById('quizModal').classList.add('hidden');
  CURRENT_REGION = null;
  CURRENT_PLACE_INDEX = null;
  CURRENT_QUESTIONS = null;
}

function submitQuiz() {
  const form = document.getElementById('quizForm');
  const formData = new FormData(form);
  let correct = 0;
  for (let i = 0; i < CURRENT_QUESTIONS.length; i++) {
    const sel = formData.get('q'+i);
    if (sel !== null && Number(sel) === CURRENT_QUESTIONS[i].answerIndex) correct++;
  }
  alert(`You scored ${correct}/${CURRENT_QUESTIONS.length}`);
  if (correct >= 17) {
    // mark unlocked
    const p = loadProgress();
    const r = p.regions[CURRENT_REGION];
    if (r.completed < CURRENT_PLACE_INDEX + 1) r.completed = CURRENT_PLACE_INDEX + 1;
    saveProgress(p);
    closeQuiz();
    renderRegion();
    alert('✅ Great job! Next place unlocked.');
  } else {
    alert('❌ Need at least 17 correct to unlock the next place. Try again!');
  }
}

// Re-render region list
function renderRegion() {
  const container = document.getElementById('placesContainer');
  if (!container || !window.RegionData) return;
  const region = container.dataset.region;
  const arr = window.RegionData.places;
  const prog = loadProgress().regions[region];

  container.innerHTML = '';

  arr.forEach((place, idx) => {
    const unlocked = idx === 0 || prog.completed > idx-1;
    const cleared  = prog.completed > idx;

    const card = document.createElement('article');
    card.className = 'place-card';
    card.innerHTML = `
      <img src="${place.image}" alt="${place.title}">
      <div class="content">
        <h3>${idx+1}. ${place.title} ${cleared ? '<span class="badge">✔ Cleared</span>' : ''}</h3>
        <p>${place.subtitle || ''}</p>
      </div>
      <div class="actions">
        ${unlocked ? `
           <button class="enter-btn" onclick="window.open('${place.video}', '_blank')">▶ 3D Video</button>
           <button class="btn-secondary" onclick="openQuiz('${region}', ${idx})">🧠 Take 20-Q Quiz</button>
        ` : `<div class="lock-note">🔒 Locked — clear the previous place first.</div>`}
      </div>
    `;
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', renderRegion);
modal.classList.remove('hidden');
modal.scrollTop = 0; // reset modal scroll
form.scrollTop = 0;  // reset form scroll just in case

