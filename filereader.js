let foundInformations = [];



document.getElementById("input-file").addEventListener("change",function(e){
    document.getElementById("course-list-wrapper").style.display = "Block";
    //e.target.style.display = "none";
});


function resultMessage(message, color) {
    const result = document.getElementById('result');
    result.textContent = message;
    result.style.color = color;

    setTimeout(function() {
        result.textContent = "";
        result.style.color = "black";
    },2000);


}

function searchWordInExcel() {
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
            foundInformations.push([word, courseInfo]);

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

