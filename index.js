

function addToList() {

    const inputText = document.getElementById("input-text");
    const listContainer = document.getElementById("list-container");

    if (inputText.value === "") {
        return null;
    }
    
    // Creates list element
    listElement = document.createElement("li");
    listElement.innerHTML = inputText.value;
    listElement.style.textTransform = "uppercase";
    listContainer.appendChild(listElement);

    // Creates Span for deleting the course
    const spanElement = document.createElement("span"); 
    spanElement.innerHTML = "\u00d7";
    spanElement.title = "Delete the course from this list";
    

    // Adds the function to span so it can delete the course 
    spanElement.addEventListener("click",function(e){
        console.log(listContainer.children.length);
        if (listContainer.children.length == 2) {
            document.getElementById("note").style.display = "Block";
        }

        // Removes the item in list
        const courseName = e.target.parentElement.textContent.replace("×","").toUpperCase();
        console.log("courseName: " + courseName);

        // Find the index of the entry with the predefined name
        const index = foundInformations.findIndex(entry => entry[0] === courseName);

        if (index !== -1) {
            // If found, remove the dictionary associated with the name
            const removedEntry = foundInformations.splice(index, 1);
            console.log(`Removed: ${removedEntry[0][0]}`);
        } else {
            console.log('Name not found');
        }

        e.target.parentElement.remove();
        console.log(foundInformations);

        
    });

    listElement.appendChild(spanElement);

    document.getElementById("note").style.display = "None";

    inputText.value = "";
    
}


function closePopUp() {

    document.getElementById('pop-up').style.display = 'None';
}

function openPopUp() {

    document.getElementById('pop-up').style.display = 'Block';
}


document.getElementById('input-text').addEventListener('keyup', function(event) {
    // Check if the key pressed is "Enter"
    if (event.key === 'Enter') {
        // Prevent the default action if necessary (like form submission)
        event.preventDefault();

        // Call a function or trigger some action
        searchWordInExcel();
    }
});