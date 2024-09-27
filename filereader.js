
let foundInformations = []; // Course data gets stored in this



document.getElementById("input-file").addEventListener("change",function(e){
    document.getElementById("course-list-wrapper").style.display = "Block";
    //e.target.style.display = "none";
});


function resultMessage(message, color) {

    // Debuging function that creates a message for a brief second with given color

    const result = document.getElementById('result');
    result.textContent = message;
    result.style.color = color;

    setTimeout(function() {
        result.textContent = "";
        result.style.color = "black";
    },2000);


}

function searchWordInExcel() {

    // This function searches input-text value inside excel file, 
    // if found, function proceeds to get it's informations and stores them in a list

    const word = document.getElementById('input-text').value.trim().toUpperCase();
    const fileInput = document.getElementById('input-file');
    
    

    // If nothing's writen
    if (!word) {
        resultMessage('Please enter a word to search.',"red");
        return;
    }

    // If no excel file was uploaded
    if (fileInput.files.length === 0) {
        resultMessage('Please select an Excel file.',"red");
        return;
    }

    if (!/^[A-Za-z0-9]+$/.test(word) || !/[A-Za-z]/.test(word) || !/[0-9]/.test(word)) {
        resultMessage('The code you enter needs to contain both letters and numbers', "red");
        return;
    }
    

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        let courseInfo = [];
        let foundCount = 0;

           // Iterate over each sheet
           workbook.SheetNames.forEach(function(sheetName) {
            const sheet = workbook.Sheets[sheetName];
            const sheetJson = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Use for loops to get the row and column indexes
            for (let rowIndex = 0; rowIndex < sheetJson.length; rowIndex++) {
                const row = sheetJson[rowIndex];

                for (let colIndex = 0; colIndex < row.length; colIndex++) {
                    const cell = row[colIndex];

                    if (typeof cell === 'string' && cell.includes(word)) {
                        foundCount++;

                        const day = sheetJson[1][colIndex];
                        const time = sheetJson[2][colIndex];
                        const location = row[0];

                        courseInfo.push({
                            name: cell.split(" ")[0] || "N/A",
                            professor: cell.split(" ")[1] || "N/A",
                            // row: rowIndex + 1, // Excel rows are 1-based
                            // column: colIndex + 1, // Excel columns are 1-based
                            day: day.trim(),
                            time: time,
                            location: location
                        });
                        
                    }
                }
            }
        });

        if (foundCount > 0) {
            addToList();
            resultMessage(`"${word}" succesfully found`,'green');
            foundInformations.push([word, courseInfo.sort()]);

            //console.log (`The word "${word}" was found ${foundCount} time(s) in the Excel file at the following positions: `);
            //courseInfo.forEach(pos => {
            //    console.log(`Name: ${pos.name}, Professor: ${pos.professor}, Day: ${pos.day} , Time: ${pos.time}, Location: ${pos.location} \n`);
            //});

            // console.log(foundInformations);
        } else {
            resultMessage(`The word "${word}" was not found in the Excel file.`, 'red');
        }
    };

    reader.onerror = function() {
        result.textContent = 'Error reading file. Please try again.';
    };

    reader.readAsArrayBuffer(file);
}


function startProcess() {

    

    if (foundInformations.length  < 1) {
        alert("There is no course data to proceed");
        return;
    }

    document.getElementById("end-result").innerHTML = "<div id='tab'></div>";
    document.getElementById("end-result").style.display = "block";



    // Iterates through each course in the list
    for (let i = 0; i < foundInformations.length; i++) {

        // This creates tab for each course in the list
        const wrapper = document.createElement("div");
        wrapper.id = "tab - " + foundInformations[i][0];
        wrapper.className = "tabcontent";
        document.getElementById("end-result").appendChild(wrapper);

        // Creates tab link so we can reach to contents
        const tabLink = document.createElement("button");
        tabLink.className = "tablinks";
        tabLink.textContent = foundInformations[i][0];
        tabLink.onclick = function(event){
            openTab(event, foundInformations[i][0]);
        };
        document.getElementById("tab").appendChild(tabLink);

        let previousNames = [];

        // Details about the related course 
        foundInformations[i][1].forEach(info => {
           
            const text = document.createElement("p");
            text.innerHTML = `<strong>CourseName:</strong> ${info.name} <strong>Professor:</strong> ${info.professor} <strong>Location:</strong> ${info.location} <strong>Time:</strong> ${info.time} <strong>Day:</strong> ${info.day}`;
            wrapper.appendChild(text);

            if (previousNames.includes(info.name) == false) {

                console.log("Different group spotted!");

                const group = document.createElement("div");
                group.id = info.name;
                group.className = "course-group";
                group.appendChild(text);
                previousNames.push(info.name);
                wrapper.appendChild(group);
                
                

                

            }else if(previousNames.length > 0) {
                console.log("Putting this to same group...");
                const group = document.getElementById(info.name);
                group.appendChild(text);
                wrapper.appendChild(group);

            }

            console.log(previousNames);
            
        });

        // Opens the first tab by default
        if (i == 0) {
            tabLink.click();
        }
        
        

    }

}