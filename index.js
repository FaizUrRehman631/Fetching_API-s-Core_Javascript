
// Fetching API's 
function fetchData() {
    fetch("http://127.0.0.1:8000/api/students")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data);
  
        const students = data.data;
  
        const headers = [
          "ID",
          "Name",
          "Email",
          "Role",
          "Age",
          "Gender",
          "Created At",
          "Actions",
        ];
  
        let output = `
            <h2>Students:</h2>
            <div style="display: flex; justify-content: center;">
              <table border="1" cellspacing="0" cellpadding="5" 
                style="text-align:center; border-collapse: collapse; width: 80%; max-width: 900px;">
                <thead>
                  <tr style="background-color: #f2f2f2;">
                    ${headers.map((header) => `<th>${header}</th>`).join("")}
                  </tr>
                </thead>
                <tbody>
          `;
  
        students.forEach((student) => {
          output += `
              <tr id="row-${student.id}">
                <td>${student.id}</td>
                <td id="name-${student.id}">${student.name}</td>
                <td id="email-${student.id}">${student.email}</td>
                <td id="role-${student.id}">${student.role}</td>
                <td id="age-${student.id}">${student.age}</td>
                <td id="gender-${student.id}">${student.gender}</td>
                <td>${new Date(student.created_at).toLocaleDateString()}</td>
                <td>
                  <button onclick="updateStudent(${student.id})" 
                    style="color: white; background-color: blue; border: none; padding: 5px 10px; cursor: pointer;">Update</button>
                  <button onclick="deleteStudent(${student.id})" 
                    style="color: white; background-color: red; border: none; padding: 5px 10px; cursor: pointer;">Delete</button>
                </td>
              </tr>
            `;
        });
  
        output += `</tbody></table></div>`;
  
        document.getElementById("output").innerHTML = output;
      })
      .catch((error) => console.error("Error fetching data:", error));
}

  
// Function to Add new Student
function addStudent(){
    const name = prompt("Enter student name:");
    const email = prompt("Enter student email:");
    const password = prompt("Enter student password:");
    const role = prompt("Enter student role (admin/user):");
    const age = prompt("Enter student age:");
    const gender = prompt("Enter student gender (male/female):");

    if (!name || !email || !password || !role || !age || !gender) {
        alert("All fields are required!");
        return;
    }

    const studentData = {
        name: name,
        email: email,
        password: password, // Password is required in your API
        role: role,
        age: parseInt(age),
        gender: gender
    };

    fetch("http://127.0.0.1:8000/api/students",{
        method: "POST",
        headers: {
            "content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
    })
    .then((response)=>{
        console.log("Raw response:", response);
        if(!response.ok){
            throw new Error('HTTP error! status: ${response.status}');
        }
        return response.json();
    })
    .then(data => {
        console.log("Student Added:", data);

        if (data.success) {
            alert("Student added successfully!");
        } else {
            alert("Failed to add student.");
        }
    })
    .catch(error => console.error("Error adding student:", error));

}



  
// Function to update students API's
function updateStudent(id) {
    console.log("Updating student ID:", id);

    const nameElement = document.getElementById(`name-${id}`);
    const emailElement = document.getElementById(`email-${id}`);
    const roleElement = document.getElementById(`role-${id}`);
    const ageElement = document.getElementById(`age-${id}`);
    const genderElement = document.getElementById(`gender-${id}`);

    if (!nameElement || !emailElement || !roleElement || !ageElement || !genderElement) {
        console.error("Error: One or more student elements not found.");
        alert("Student data is missing or not loaded correctly.");
        return;
    }

    const newName = prompt("Enter new name:", nameElement.innerText) || nameElement.innerText;
    const newEmail = prompt("Enter new email:", emailElement.innerText) || emailElement.innerText;
    const newRole = prompt("Enter new role (admin/user):", roleElement.innerText) || roleElement.innerText;
    const newAge = prompt("Enter new age:", ageElement.innerText) || ageElement.innerText;
    const newGender = prompt("Enter new gender (male/female):", genderElement.innerText) || genderElement.innerText;

    const updatedData = { name: newName, email: newEmail, role: newRole, age: newAge, gender: newGender };

    fetch(`http://127.0.0.1:8000/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    })
    .then(response => {
        console.log("Raw response:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        console.log("Update Response:", data);

        if (data.success) {
            nameElement.innerText = newName;
            emailElement.innerText = newEmail;
            roleElement.innerText = newRole;
            ageElement.innerText = newAge;
            genderElement.innerText = newGender;
            alert("Student updated successfully!");
        } else {
            alert("Failed to update the student in the database.");
        }
    })
    .catch(error => console.error("Error updating student:", error));
}



  // Function to delete a student from API 
  function deleteStudent(id) {
    console.log("Deleted Student Id:", id);
  
    if (!confirm("Are you sure you want to delete this student?")) return;
  
    fetch(`http://127.0.0.1:8000/api/students/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Deleted student:", data);
        if (data.success) {
          document.getElementById(`row-${id}`).remove();
        } else {
          alert("Failed to delete the student.");
        }
      })
      .catch((error) => console.error("Error deleting student:", error));
  }