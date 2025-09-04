function findEmployee(employee, name) {
  if (employee.name.toLowerCase() === name.toLowerCase()) return employee;

  for (let sub of employee.subordinates) {
    let result = findEmployee(sub, name);
    if (result) return result;
  }
  return null;
}

function renderSearchResult(emp) {
  if (!emp) return "<p> Employee not found</p>";

  return `
    <div class="employee-details">
      <h3> Search Result</h3>
      <ul>
        <li><strong>Name:</strong> ${emp.name}</li>
        <li><strong>Role:</strong> ${emp.role}</li>
        <li><strong>Department:</strong> ${emp.department}</li>
        <li>
          <strong>Tasks Completed:</strong> ${emp.tasks} 
          <span class="${emp.tasks < 5 ? "bad" : "good"}">${emp.tasks < 5 ? "Bad Progress" : " Good Progress"}</span>
        </li>
        <li>
          <strong>Data Shared:</strong>
          <ul>
            ${emp.sharedData.map(data => `<li>${data}</li>`).join("")}
          </ul>
        </li>
      </ul>
      ${
        emp.subordinates.length > 0
          ? `<h4> Subordinates:</h4>
             <ul>${emp.subordinates.map(sub => renderTree(sub)).join("")}</ul>`
          : "<p>No subordinates</p>"
      }
    </div>
  `;
}
