const form = document.querySelector(".form");
const dept_select = document.querySelector(".dept");
const check_boxes = document.querySelector(".check-boxes");
const regRanges = document.querySelector(".regRanges");


//prevents page reload when ENTER is pressed
form.addEventListener("keydown",(evt) => {
    if(evt.key == "ENTER"){
        evt.preventDefault();
    }
});


//adds or removes register no section through check-boxes
check_boxes.addEventListener("change",(evt) => {
    const regRange = document.createElement("div");
    const course = document.createElement("span");
    const regStart = document.createElement("input");
    const regEnd = document.createElement("input");

    course.textContent = evt.target.value.toUpperCase();
    regRange.classList.add("regRange",`${evt.target.value}`);
    regStart.classList.add("regStart");
    regEnd.classList.add("regEnd");

    regRange.append(course,regStart,"-",regEnd);


    if (evt.target.checked){
        regRanges.appendChild(regRange);
    }
    else{
        const del_el = document.querySelector(`.regRange.${evt.target.value}`);
        del_el.remove();
    }
});


const submitButton = document.querySelector("button");
const noOfHalls = document.querySelector(".halls .num_inp");
const noOfRows = document.querySelector(".hall-row .num_inp");
const noOfCols = document.querySelector(".hall-col .num_inp");


submitButton.addEventListener("click",(evt) => {
    let halls = noOfHalls.value;
    let rows = noOfRows.value;
    let cols = noOfCols.value;
    
    const startRanges = document.querySelectorAll(".regRange .regStart");
    const endRanges = document.querySelectorAll(".regRange .regEnd");
    const courses = document.querySelectorAll(".regRange");

    let coursesDet = [];
    let hallStructs = [];

    for (let i = 0;i<halls;i++){
        let hallStruct = [];
        for (let i = 0;i<rows;i++){
            hallStruct[i] = [];
            for (let j = 0;j<cols;j++){
                hallStruct[i][j] = 0;
            }
        }
        hallStructs.push(hallStruct);
    }


    for (x of courses){
        let  courseDet = {};

        courseDet.courseName = x.classList[1];
        courseDet.start = x.querySelector(".regStart").value;
        courseDet.end = x.querySelector(".regEnd").value;
        courseDet.studentCount = courseDet.end-courseDet.start + 1;
        coursesDet.push(courseDet);
    }

    coursesDet.sort((a,b) => b.studentCount-a.studentCount);


    let studentLists = [];
    for (let course of coursesDet){
        let studentList = [];
        let student = {};
        let name = course.courseName;
        for (let i = Number(course.start);i<=Number(course.end);i++){
            studentList.push(i);
        }
        student.name = name;
        student.students = studentList;
        studentLists.push(student);
    }

    console.log(coursesDet);
    console.log(studentLists);
    

    let deptPoint = 0;


    // -------- STRICT CHECKERBOARD GROUP ISOLATION --------

    for (let hall of hallStructs) {

        let groupASeats = [];
        let groupBSeats = [];

        // Separate seats
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if ((r + c) % 2 === 0) {
                    groupASeats.push([r, c]);
                } else {
                    groupBSeats.push([r, c]);
                }
            }
        }

        // Sort departments by size
        studentLists.sort((a, b) => b.students.length - a.students.length);

        // Assign departments to groups alternately
        let groupADepts = [];
        let groupBDepts = [];

        studentLists.forEach((dept, index) => {
            if (index % 2 === 0) {
                groupADepts.push(dept);
            } else {
                groupBDepts.push(dept);
            }
        });

        function fillGroup(seats, deptList) {

            let deptIndex = 0;

            for (let [r, c] of seats) {

                let attempts = 0;

                while (
                    attempts < deptList.length &&
                    deptList[deptIndex].students.length === 0
                ) {
                    deptIndex = (deptIndex + 1) % deptList.length;
                    attempts++;
                }

                if (attempts >= deptList.length) return;

                let dept = deptList[deptIndex];

                hall[r][c] = `${dept.name.toUpperCase()}_${dept.students.shift()}`;

                deptIndex = (deptIndex + 1) % deptList.length;
            }
        }

        fillGroup(groupASeats, groupADepts);
        fillGroup(groupBSeats, groupBDepts);
    }

    displayHalls(hallStructs, rows, cols);
   
});


function displayHalls(hallStructs, rows, cols) {

    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";

    hallStructs.forEach((hall, hallIndex) => {

        // Hall Title
        const hallTitle = document.createElement("h3");
        hallTitle.textContent = `Hall ${hallIndex + 1}`;
        hallTitle.style.margin = "20px 0 10px 0";
        outputDiv.appendChild(hallTitle);

        // Create Table
        const table = document.createElement("table");
        table.style.borderCollapse = "separate";
        table.style.borderSpacing = "6px";   // spacing between cells
        table.style.marginBottom = "30px";

        for (let r = 0; r < rows; r++) {

            const tr = document.createElement("tr");

            for (let c = 0; c < cols; c++) {

                const td = document.createElement("td");

                // Seat Content
                td.textContent = hall[r][c] ? hall[r][c] : "—";

                // Proper spacing & size
                td.style.width = "90px";
                td.style.height = "40px";
                td.style.textAlign = "center";
                td.style.verticalAlign = "middle";
                td.style.border = "1px solid #ccc";
                td.style.borderRadius = "6px";
                td.style.fontSize = "13px";
                td.style.backgroundColor = "#f5f5f5";

                if (td.innerText.slice(0,3) == "CSE"){
                    td.style.backgroundColor = "blue";
                }
                else if (td.innerText.slice(0,3) == "EEE"){
                    td.style.backgroundColor = "green";
                }
                else if (td.innerText.slice(0,3) == "ECE"){
                    td.style.backgroundColor = "grey";
                }
                else if (td.innerText.slice(0,4) == "MECH"){
                    td.style.backgroundColor = "brown";                    
                }
                else if (td.innerText.slice(0,4) == "AERO"){
                    td.style.backgroundColor = "cyan";
                }

                tr.appendChild(td);
            }

            table.appendChild(tr);
        }

        outputDiv.appendChild(table);
    });
}
