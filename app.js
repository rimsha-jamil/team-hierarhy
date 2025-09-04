

// helper function
let idCounter = 1;
function assignIds(node) {
  node._id = "n" + (idCounter++);
  (node.subordinates || []).forEach(assignIds);
}
assignIds(team);

function findNodeById(node, id) {
  if (node._id === id) return node;
  for (const c of node.subordinates || []) {
    const f = findNodeById(c, id);
    if (f) return f;
  }
  return null;
}

function findExact(node, nameLower) {
  if (node.name.toLowerCase() === nameLower) return node;
  for (const c of node.subordinates || []) {
    const f = findExact(c, nameLower);
    if (f) return f;
  }
  return null;
}

function findPartial(node, nameLower, out) {
  if (node.name.toLowerCase().includes(nameLower)) out.push(node);
  for (const c of node.subordinates || []) findPartial(c, nameLower, out);
}


// rendering
const treeRoot = document.getElementById("tree");
const detailsDiv = document.getElementById("details");
let currentSelectedId = null;

function renderTree(node) {
  const li = document.createElement("li");
  li.dataset.id = node._id;

  const header = document.createElement("div");
  header.className = "node-header";

  // toggle or spacer
  const childUL = document.createElement("ul");
  if (node.subordinates && node.subordinates.length > 0) {
    const toggle = document.createElement("button");
    toggle.className = "toggle";
    toggle.textContent = "−";
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      childUL.classList.toggle("collapsed");
      toggle.textContent = childUL.classList.contains("collapsed") ? "+" : "−";
    });
    header.appendChild(toggle);
  } else {
    const sp = document.createElement("span");
    sp.className = "spacer";
    header.appendChild(sp);
  }

  const nameSpan = document.createElement("span");
  nameSpan.className = "node-name";
  nameSpan.textContent = node.name;
  nameSpan.addEventListener("click", () => selectNode(node._id));
  header.appendChild(nameSpan);

  const subtext = document.createElement("span");
  subtext.className = "node-subtext";
  subtext.textContent = ` (${node.role}) • ${node.department}`;
  header.appendChild(subtext);

  const progress = document.createElement("span");
  progress.className = "progress " + (node.tasksCompleted < 5 ? "bad" : "good");
  progress.textContent = node.tasksCompleted < 5 ? "Bad Progress" : `Tasks: ${node.tasksCompleted}`;
  header.appendChild(progress);

  li.appendChild(header);

  // children
  if (node.subordinates && node.subordinates.length > 0) {
    for (const c of node.subordinates) {
      childUL.appendChild(renderTree(c));
    }
    li.appendChild(childUL);
  }
  return li;
}

function showTree() {
  treeRoot.innerHTML = "";
  const ul = document.createElement("ul");
  ul.appendChild(renderTree(team));
  treeRoot.appendChild(ul);
}
showTree();


//  Selection & Details
function selectNode(id) {
  const node = findNodeById(team, id);
  if (!node) return;

  // highlight
  const prev = treeRoot.querySelector(".selected");
  if (prev) prev.classList.remove("selected");
  const li = treeRoot.querySelector(`[data-id="${id}"]`);
  if (li) li.classList.add("selected");

  // details
  renderDetails(node);
}

function renderDetails(node) {
  detailsDiv.innerHTML = `
    <h4>${node.name} (${node.role})</h4>
    <p><strong>Department:</strong> ${node.department}</p>
    <p><strong>Tasks Completed:</strong> ${node.tasksCompleted} 
      ${node.tasksCompleted < 5 ? "<span style='color:red;font-weight:bold'>Bad Progress</span>" : ""}
    </p>
    <p><strong>Data Shared:</strong></p>
    <ul>${(node.sharedData || []).map(d => `<li>${d}</li>`).join("")}</ul>
    <p><strong>Subordinates:</strong></p>
    ${node.subordinates && node.subordinates.length > 0 
      ? `<ul>${node.subordinates.map(s => `<li>${s.name} (${s.role})</li>`).join("")}</ul>`
      : "<p>No subordinates.</p>"
    }
  `;
}


// search
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const matchesDiv = document.getElementById("matches");

function searchPerson() {
  matchesDiv.innerHTML = "";
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return;

  const exact = findExact(team, q);
  if (exact) {
    selectNode(exact._id);
    return;
  }

  const partials = [];
  findPartial(team, q, partials);

  if (partials.length === 0) {
    matchesDiv.innerHTML = "<p>No person found.</p>";
    return;
  }
  if (partials.length === 1) {
    selectNode(partials[0]._id);
    return;
  }

  matchesDiv.innerHTML = "<p>Multiple matches:</p>";
  partials.forEach(p => {
    const b = document.createElement("button");
    b.className = "match-btn";
    b.textContent = `${p.name} (${p.role})`;
    b.addEventListener("click", () => {
      selectNode(p._id);
      matchesDiv.innerHTML = "";
    });
    matchesDiv.appendChild(b);
  });
}

searchBtn.addEventListener("click", searchPerson);
searchInput.addEventListener("keydown", (e) => { if (e.key === "Enter") searchPerson(); });
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  matchesDiv.innerHTML = "";
  detailsDiv.innerHTML = "<p>Search a name or click someone in the tree to see details.</p>";
});
