document.addEventListener("DOMContentLoaded", () => {
  // Show full tree initially
  document.getElementById("tree").innerHTML = `<ul>${renderTree(teamData)}</ul>`;

  // Search button click
  document.getElementById("searchBtn").addEventListener("click", () => {
    const name = document.getElementById("searchInput").value.trim();
    const emp = findEmployee(teamData, name);
    document.getElementById("searchResult").innerHTML = renderSearchResult(emp);
  });
});
