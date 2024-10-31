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

            // Get the bounding rectangle of the image
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
                
                // Correct the offset based on imageRect
                iconElement.style.left = `${icon.loc_x - (-imageRect.left)}px`; // Add the image left offset
                iconElement.style.top = `${icon.loc_y - (-imageRect.top)}px`; // Add the image top offset

                iconElement.innerHTML = '<img src="icon2.png" alt="Icon" style="width: 20px; height: 20px;" />'; // Replace with your icon image

                // Add mouseover and mouseout events to the iconElement
                iconElement.addEventListener('mouseenter', () => {
                    tooltip.textContent = icon.location_name; // Set tooltip text
                    tooltip.style.display = 'block'; // Show the tooltip
                    tooltip.style.zIndex = '500'
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

window.onload = loadIcons;

// Mouseover event for image coordinates
document.addEventListener("DOMContentLoaded", () => {
    const img = document.querySelector(".zoomist-image img");
    const coordX = document.getElementById("coordX");
    const coordY = document.getElementById("coordY");

    img.addEventListener("mousemove", (event) => {
        const rect = img.getBoundingClientRect();
        const x = Math.round(event.clientX - rect.left);
        const y = Math.round(event.clientY - rect.top);
        coordX.textContent = x;
        coordY.textContent = y;
    });

    img.addEventListener("mouseleave", () => {
        coordX.textContent = 0;
        coordY.textContent = 0;
    });
});

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

// Load icons on page load
window.onload = loadIcons;

// Load icons and other functionality
window.onload = function() {
    loadIcons(); // Load icons initially

    // Add a click event to the whole document
    document.addEventListener("click", () => {
        document.getElementById('locX').value = 50; // Set locX to 50
        document.getElementById('locY').value = 80; // Set locY to 80
    });
};