// ==== Team Data ====
const team = {
  name: "Fahad Ansari",
  role: "CEO & Director",
  department: "Management",
  tasks: 12,
  sharedData: ["Company Strategy", "Financial Reports", "Board Reports"],
  subordinates: [
    {
      name: "Emma O'Meara",
      role: "Operations Manager",
      department: "Operations",
      tasks: 4,
      sharedData: ["Project Timelines", "Team Reports"],
      subordinates: [
        {
          name: "Ali Khan",
          role: "Team Lead",
          department: "Development",
          tasks: 7,
          sharedData: ["Codebase Access", "API Documentation"],
          subordinates: [
            {
              name: "Sara Ahmed",
              role: "Frontend Developer",
              department: "Development",
              tasks: 3,
              sharedData: ["UI Mockups", "Bug Reports"],
              subordinates: []
            },
            {
              name: "Usman Raza",
              role: "Backend Developer",
              department: "Development",
              tasks: 9,
              sharedData: ["Database Credentials", "Server Logs"],
              subordinates: []
            }
          ]
        },
        {
          name: "Maria Lopez",
          role: "QA Lead",
          department: "Quality Assurance",
          tasks: 6,
          sharedData: ["Test Cases", "QA Reports"],
          subordinates: [
            {
              name: "James Carter",
              role: "QA Engineer",
              department: "Quality Assurance",
              tasks: 2,
              sharedData: ["Bug Reports", "Test Results"],
              subordinates: []
            },
            {
              name: "Sophia Ali",
              role: "Automation Tester",
              department: "Quality Assurance",
              tasks: 8,
              sharedData: ["Selenium Scripts", "CI/CD Logs"],
              subordinates: []
            }
          ]
        }
      ]
    },
    {
      name: "David Kim",
      role: "Marketing Head",
      department: "Marketing",
      tasks: 10,
      sharedData: ["Marketing Strategy", "Campaign Budgets"],
      subordinates: [
        {
          name: "Linda Green",
          role: "Social Media Manager",
          department: "Marketing",
          tasks: 5,
          sharedData: ["Social Media Content", "Ad Campaigns"],
          subordinates: []
        },
        {
          name: "Ravi Patel",
          role: "SEO Specialist",
          department: "Marketing",
          tasks: 3,
          sharedData: ["Keyword Reports", "Backlink List"],
          subordinates: []
        }
      ]
    },
    {
      name: "Ayesha Khan",
      role: "HR Manager",
      department: "Human Resources",
      tasks: 11,
      sharedData: ["Employee Records", "Payroll Data"],
      subordinates: [
        {
          name: "Tom Williams",
          role: "Recruiter",
          department: "HR",
          tasks: 6,
          sharedData: ["Candidate Database", "Interview Reports"],
          subordinates: []
        },
        {
          name: "Nina Parker",
          role: "Training Specialist",
          department: "HR",
          tasks: 4,
          sharedData: ["Training Materials"],
          subordinates: []
        }
      ]
    }
  ]
};

// ==== Render Functions ====
function renderTree(employee) {
  let progress = employee.tasks < 5 ? "Bad Progress" : "Good Progress";

  return `
    <li>
      <div><strong>${employee.name}</strong> (${employee.role})</div>
      <p><strong>Department:</strong> ${employee.department}</p>
      <p><strong>Tasks:</strong> ${employee.tasks} 
        <span class="${employee.tasks < 5 ? "bad" : "good"}">${progress}</span>
      </p>
      <p><strong>Data Shared:</strong></p>
      <ul>${employee.sharedData.map(d => `<li>${d}</li>`).join("")}</ul>
      ${
        employee.subordinates.length > 0
          ? `<p><strong>Subordinates:</strong></p>
             <ul>${employee.subordinates.map(renderTree).join("")}</ul>`
          : ""
      }
    </li>
  `;
}

function showTree() {
  document.getElementById("tree").innerHTML = `<ul>${renderTree(team)}</ul>`;
}

// ==== Search Functions ====
function findEmployee(employee, name) {
  if (employee.name.toLowerCase() === name.toLowerCase()) return employee;
  for (let sub of employee.subordinates) {
    let found = findEmployee(sub, name);
    if (found) return found;
  }
  return null;
}

function renderDetails(employee) {
  let progress = employee.tasks < 5 ? "Bad Progress" : "Good Progress";

  return `
    <div>
      <h3>${employee.name} (${employee.role})</h3>
      <p><strong>Department:</strong> ${employee.department}</p>
      <p><strong>Tasks:</strong> ${employee.tasks} 
        <span class="${employee.tasks < 5 ? "bad" : "good"}">${progress}</span>
      </p>
      <p><strong>Data Shared:</strong></p>
      <ul>${employee.sharedData.map(d => `<li>${d}</li>`).join("")}</ul>
      ${
        employee.subordinates.length > 0
          ? `<p><strong>Subordinates:</strong></p>
             <ul>${employee.subordinates.map(s => `<li>${s.name} (${s.role})</li>`).join("")}</ul>`
          : "<p>No subordinates.</p>"
      }
    </div>
  `;
}

function searchEmployee() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultDiv = document.getElementById("searchResult");

  if (!query) {
    resultDiv.innerHTML = "<p>Please enter a name.</p>";
    return;
  }

  let found = findEmployee(team, query);
  if (found) {
    resultDiv.innerHTML = renderDetails(found);
  } else {
    resultDiv.innerHTML = "<p>No employee found.</p>";
  }
}

// ==== Init ====
document.addEventListener("DOMContentLoaded", () => {
  showTree();
  document.getElementById("searchBtn").addEventListener("click", searchEmployee);
  document.getElementById("clearBtn").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("searchResult").innerHTML = "";
  });
});
