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
        let foundCount = 0;

        // Iterate over each sheet
        workbook.SheetNames.forEach(function(sheetName) {
            const sheet = workbook.Sheets[sheetName];
            const sheetJson = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Iterate over each row and cell in the sheet
            sheetJson.forEach(function(row) {
                row.forEach(function(cell) {
                    if (typeof cell === 'string' && cell.includes(word)) {
                        foundCount++;
                    }
                });
            });
        });

        if (foundCount > 0) {
            addToList();
            resultMessage(`"${word}" succesfully found`,'green');
            
        } else {
            resultMessage(`The word "${word}" was not found in the Excel file.`, 'red');
        }
    };

    reader.onerror = function() {
        result.textContent = 'Error reading file. Please try again.';
    };

    reader.readAsArrayBuffer(file);
}

