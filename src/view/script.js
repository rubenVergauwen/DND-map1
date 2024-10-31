// Declare global variables for coordinates
let globalX = 0;
let globalY = 0;

// Mouseover event for image coordinates
document.addEventListener("DOMContentLoaded", () => {
    const img = document.querySelector(".zoomist-image img");
    const coordX = document.getElementById("coordX");
    const coordY = document.getElementById("coordY");

    img.addEventListener("mousemove", (event) => {
        const rect = img.getBoundingClientRect();
        globalX = Math.round(event.clientX - rect.left); // Save X coordinate to global variable
        globalY = Math.round(event.clientY - rect.top); // Save Y coordinate to global variable
        coordX.textContent = globalX; // Update displayed X coordinate
        coordY.textContent = globalY; // Update displayed Y coordinate
    });

    img.addEventListener("mouseleave", () => {
        globalX = 0; // Reset global X coordinate
        globalY = 0; // Reset global Y coordinate
        coordX.textContent = 0;
        coordY.textContent = 0;
    });

    // Add a click event to the image only
    img.addEventListener("click", () => {
        // Set the locX and locY input fields with the values from global variables
        document.getElementById('locX').value = globalX; // Set locX to the global X coordinate
        document.getElementById('locY').value = globalY; // Set locY to the global Y coordinate
    });
});

// Form submission event
document.getElementById('iconForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    const locationName = document.getElementById('locationName').value;
    const locX = parseFloat(document.getElementById('locX').value);
    const locY = parseFloat(document.getElementById('locY').value);
    const pageURL = document.getElementById('pageURL').value;

    const iconData = {
        location_name: locationName,
        loc_x: locX,
        loc_y: locY,
        page_url: pageURL
    };

    // Send the data to the PHP script
    fetch('add_icon.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(iconData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Icon added successfully!');
            document.getElementById('iconForm').reset();
            loadIcons(); // Reload the icon list
        } else {
            throw new Error(data.error);
        }
    })
    .catch((error) => {
        console.error('Error adding icon:', error);
        alert('Error adding icon: ' + error.message);
    });
});

// Create a tooltip element
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
tooltip.style.color = 'white';
tooltip.style.padding = '5px';
tooltip.style.borderRadius = '5px';
tooltip.style.pointerEvents = 'none'; // Prevent mouse events on the tooltip
tooltip.style.display = 'none'; // Initially hidden
document.body.appendChild(tooltip);

// Function to load icons
function loadIcons() {
    fetch('add_icon.php')
        .then(response => response.json())
        .then(icons => {
            const iconList = document.getElementById('iconList');
            iconList.innerHTML = ''; // Clear the table body
            const image = document.querySelector(".zoomist-image img"); // Get the image element
            const imageRect = image.getBoundingClientRect();

            icons.forEach(icon => {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = icon.id;

                const nameCell = document.createElement('td');
                nameCell.textContent = icon.location_name;

                const actionsCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteIcon(icon.id); // Assign delete function

                actionsCell.appendChild(deleteButton);
                row.appendChild(idCell);
                row.appendChild(nameCell);
                row.appendChild(actionsCell);
                iconList.appendChild(row);

                // Create an overlay for each icon
                const iconElement = document.createElement('a');
                iconElement.href = icon.page_url; // Use the URL from the database
                iconElement.target = "_blank"; // Open in a new tab
                iconElement.style.position = 'absolute';
                
                // Position the icon based on its coordinates
                iconElement.style.left = `${icon.loc_x  - (-imageRect.left)}px`; 
                iconElement.style.top = `${icon.loc_y - (-imageRect.top)}px`; 

 

                iconElement.innerHTML = '<img src="icon2.png" alt="Icon" style="width: 20px; height: 20px;" />'; // Replace with your icon image

                // Add mouseover and mouseout events to the iconElement
                iconElement.addEventListener('mouseenter', () => {
                    tooltip.textContent = icon.location_name; // Set tooltip text
                    tooltip.style.display = 'block'; // Show the tooltip
                    tooltip.style.zIndex = '500';
                });

                iconElement.addEventListener('mousemove', (event) => {
                    // Position the tooltip near the mouse cursor
                    tooltip.style.left = `${event.clientX + 10}px`; // Offset to the right
                    tooltip.style.top = `${event.clientY + 10}px`; // Offset down
                });

                iconElement.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none'; // Hide the tooltip
                });

                document.querySelector('.zoomist-image').appendChild(iconElement); // Append the icon to the image container
            });
        })
        .catch(error => {
            console.error('Error loading icons:', error);
        });
}

// Load icons on page load
window.onload = loadIcons;

// Function to delete an icon
function deleteIcon(id) {
    fetch('add_icon.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Icon deleted successfully!');
            loadIcons(); // Reload the icon list
        } else {
            throw new Error(data.error);
        }
    })
    .catch(error => {
        console.error('Error deleting icon:', error);
        alert('Error deleting icon: ' + error.message);
    });
}
