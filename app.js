// helper function
let idCounter = 1;
function assignIds(node) {
  node._id = "n" + (idCounter++);
  (node.subordinates || []).forEach(assignIds);
}
assignIds(team);

function findNodeById(node, id) {
  if (node._id === id) return node;
  for (const child of node.subordinates || []) {
    const foundNode = findNodeById(child, id);
    if (foundNode) return foundNode;
  }
  return null;
}

function findExact(node, nameLower) {
  if (node.name.toLowerCase() === nameLower) return node;
  for (const child of node.subordinates || []) {
    const foundExact = findExact(child, nameLower);
    if (foundExact) return foundExact;
  }
  return null;
}

function findPartial(node, nameLower, resultArray) {
  if (node.name.toLowerCase().includes(nameLower)) resultArray.push(node);
  for (const child of node.subordinates || []) {
    findPartial(child, nameLower, resultArray);
  }
}


// rendering
const treeRoot = document.getElementById("tree");
const detailsDiv = document.getElementById("details");
let currentSelectedId = null;

function renderTree(node) {
  const listItem = document.createElement("li");
  listItem.dataset.id = node._id;

  const headerDiv = document.createElement("div");
  headerDiv.className = "node-header";

  // toggle or spacer
  const childList = document.createElement("ul");
  if (node.subordinates && node.subordinates.length > 0) {
    const toggleButton = document.createElement("button");
    toggleButton.className = "toggle";
    toggleButton.textContent = "-";
    toggleButton.addEventListener("click", (event) => {
      event.stopPropagation();
      childList.classList.toggle("collapsed");
      toggleButton.textContent = childList.classList.contains("collapsed") ? "+" : "−";
    });
    headerDiv.appendChild(toggleButton);
  } else {
    const spacer = document.createElement("span");
    spacer.className = "spacer";
    headerDiv.appendChild(spacer);
  }

  const nameSpan = document.createElement("span");
  nameSpan.className = "node-name";
  nameSpan.textContent = node.name;
  nameSpan.addEventListener("click", () => selectNode(node._id));
  headerDiv.appendChild(nameSpan);

  const roleAndDept = document.createElement("span");
  roleAndDept.className = "node-subtext";
  roleAndDept.textContent = ` (${node.role}) • ${node.department}`;
  headerDiv.appendChild(roleAndDept);

  const progressSpan = document.createElement("span");
  progressSpan.className = "progress " + (node.tasksCompleted < 5 ? "bad" : "good");
  progressSpan.textContent = node.tasksCompleted < 5 ? "Bad Progress" : `Tasks: ${node.tasksCompleted}`;
  headerDiv.appendChild(progressSpan);

  listItem.appendChild(headerDiv);

  // children
  if (node.subordinates && node.subordinates.length > 0) {
    for (const child of node.subordinates) {
      childList.appendChild(renderTree(child));
    }
    listItem.appendChild(childList);
  }
  return listItem;
}

function showTree() {
  treeRoot.innerHTML = "";
  const rootList = document.createElement("ul");
  rootList.appendChild(renderTree(team));
  treeRoot.appendChild(rootList);
}
showTree();


//  Selection & Details
function selectNode(id) {
  const selectedNode = findNodeById(team, id);
  if (!selectedNode) return;

  // highlight
  const previouslySelected = treeRoot.querySelector(".selected");
  if (previouslySelected) previouslySelected.classList.remove("selected");
  const currentListItem = treeRoot.querySelector(`[data-id="${id}"]`);
  if (currentListItem) currentListItem.classList.add("selected");

  // details
  renderDetails(selectedNode);
}

function renderDetails(node) {
  detailsDiv.innerHTML = `
    <h4>${node.name} (${node.role})</h4>
    <p><strong>Department:</strong> ${node.department}</p>
    <p><strong>Tasks Completed:</strong> ${node.tasksCompleted} 
      ${node.tasksCompleted < 5 ? "<span style='color:red;font-weight:bold'>Bad Progress</span>" : ""}
    </p>
    <p><strong>Data Shared:</strong></p>
    <ul>${(node.sharedData || []).map(sharedItem => `<li>${sharedItem}</li>`).join("")}</ul>
    <p><strong>Subordinates:</strong></p>
    ${node.subordinates && node.subordinates.length > 0 
      ? `<ul>${node.subordinates.map(subordinate => `<li>${subordinate.name} (${subordinate.role})</li>`).join("")}</ul>`
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
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  const exactMatch = findExact(team, query);
  if (exactMatch) {
    selectNode(exactMatch._id);
    return;
  }

  const partialMatches = [];
  findPartial(team, query, partialMatches);

  if (partialMatches.length === 0) {
    matchesDiv.innerHTML = "<p>No person found.</p>";
    return;
  }
  if (partialMatches.length === 1) {
    selectNode(partialMatches[0]._id);
    return;
  }

  matchesDiv.innerHTML = "<p>Multiple matches:</p>";
  partialMatches.forEach(match => {
    const matchButton = document.createElement("button");
    matchButton.className = "match-btn";
    matchButton.textContent = `${match.name} (${match.role})`;
    matchButton.addEventListener("click", () => {
      selectNode(match._id);
      matchesDiv.innerHTML = "";
    });
    matchesDiv.appendChild(matchButton);
  });
}

searchBtn.addEventListener("click", searchPerson);
searchInput.addEventListener("keydown", (event) => { if (event.key === "Enter") searchPerson(); });
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  matchesDiv.innerHTML = "";
  detailsDiv.innerHTML = "<p>Search a name or click someone in the tree to see details.</p>";
});
