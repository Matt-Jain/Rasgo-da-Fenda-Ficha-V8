let characters = [];
let currentSkills = {};
let points = 200;

const skillList = [
  "Luta Corpo a Corpo","Armas Brancas","Armas de Fogo","Esquiva",
  "Percepção","Investigação","Ocultismo","Intuição",
  "Atletismo","Furtividade","Resistência","Acrobacia",
  "Conhecimento","Diplomacia",
  "Persuasão","Enganação","Intimidação","Empatia"
];

function login() {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  showSection("menu");
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function goToSkills() {
  currentSkills = {};
  points = 200;
  skillList.forEach(s => currentSkills[s] = 20);
  points -= skillList.length * 20;

  const div = document.getElementById("skills");
  div.innerHTML = "";
  skillList.forEach(skill => {
    const row = document.createElement("div");
    row.className = "skill";
    row.innerHTML = `
      <span>${skill}</span>
      <input type="number" value="20" min="0" onchange="updateSkill('${skill}', this)">
    `;
    div.appendChild(row);
  });

  document.getElementById("points").innerText = points;
  showSection("create-step2");
}

function updateSkill(skill, input) {
  const val = parseInt(input.value);
  const diff = val - currentSkills[skill];
  if (points - diff < 0) {
    input.value = currentSkills[skill];
    return;
  }
  currentSkills[skill] = val;
  points -= diff;
  document.getElementById("points").innerText = points;
}

function finishCharacter() {
  const c = {
    name: charName.value,
    player: playerName.value,
    appearance: appearance.value,
    history: history.value,
    goals: goals.value,
    skills: {...currentSkills},
    vida: 15, sanidade: 15, incontrole: 0,
    despertou: false
  };
  characters.push(c);
  renderCharacters();
  renderDiceCharacters();
  showSection("menu");
}

function renderCharacters() {
  const list = document.getElementById("characterList");
  list.innerHTML = "";
  characters.forEach((c,i)=>{
    const div = document.createElement("div");
    div.className="card";
    div.innerHTML = `
      <strong>${c.name}</strong><br>
      Vida: ${c.vida} | Sanidade: ${c.sanidade} | Incontrole: ${c.incontrole}
      <br><button onclick="despertar(${i})">Despertar</button>
    `;
    list.appendChild(div);
  });
}

function despertar(i) {
  const c = characters[i];
  if (c.despertou) return alert("Já despertou");
  const roll = Math.floor(Math.random()*100)+1;
  if (roll >= 11) c.vida += 10;
  else if (roll >= 2) c.vida += 15;
  else c.vida += 20;
  c.despertou = true;
  renderCharacters();
}

function renderDiceCharacters() {
  const sel = document.getElementById("diceCharacter");
  sel.innerHTML = "";
  characters.forEach((c,i)=>{
    const o = document.createElement("option");
    o.value=i;
    o.textContent=c.name;
    sel.appendChild(o);
  });
}

function renderDiceSkills() {
  const idx = diceCharacter.value;
  const div = document.getElementById("diceSkills");
  div.innerHTML = "";
  Object.keys(characters[idx].skills).forEach(s=>{
    const b=document.createElement("button");
    b.textContent = s;
    b.onclick=()=>rollDice(idx,s);
    div.appendChild(b);
  });
}

function rollDice(i, skill) {
  const val = characters[i].skills[skill];
  const d = Math.floor(Math.random()*100)+1;
  let res = "Fracasso";
  if (d <= val) res="Sucesso";
  document.getElementById("diceResult").innerText =
    `${skill}: ${d} / ${val} → ${res}`;
}
