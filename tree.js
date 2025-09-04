function renderTree(employee) {
  let progress = employee.tasks < 5 ? " Bad Progress" : " Good Progress";

  return `
    <li>
      <ul>
        <li><strong>Name:</strong> ${employee.name}</li>
        <li><strong>Role:</strong> ${employee.role}</li>
        <li><strong>Department:</strong> ${employee.department}</li>
        <li>
          <strong>Tasks Completed:</strong> ${employee.tasks} 
          <span class="${employee.tasks < 5 ? "bad" : "good"}">${progress}</span>
        </li>
        <li>
          <strong>Data Shared:</strong>
          <ul>
            ${employee.sharedData.map(data => `<li>${data}</li>`).join("")}
          </ul>
        </li>
      </ul>
      ${
        employee.subordinates.length > 0
          ? `<p><strong>Subordinates:</strong></p>
             <ul>${employee.subordinates.map(sub => renderTree(sub)).join("")}</ul>`
          : ""
      }
    </li>
  `;
}
