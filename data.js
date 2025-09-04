const teamData = {
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
    }
  ]
};
