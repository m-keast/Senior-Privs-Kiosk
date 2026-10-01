// --- JavaScript for Interactivity ---

// Get elements from the DOM
const studentIdInput = document.getElementById('studentId');
const radioButtons = document.querySelectorAll('input[name="status"]');
const messageArea = document.getElementById('message-area');

// Function to display a message
function showMessage(message, isError) {
    messageArea.textContent = message;
    // Apply different colors based on success or error
    if (isError) {
        messageArea.classList.remove('text-red-700');
        messageArea.classList.add('text-red-500'); // Error message in a brighter red
    } else {
        messageArea.classList.remove('text-red-500');
        messageArea.classList.add('text-red-700'); // Success message in a deeper red
    }
    // Make the message visible
    messageArea.classList.remove('opacity-0');

    // Hide the message after a few seconds
    setTimeout(() => {
        messageArea.classList.add('opacity-0');
    }, 3000); // Message disappears after 3 seconds
}

// Add event listeners to radio buttons
radioButtons.forEach(radio => {
    radio.addEventListener('change', async function() {
        const studentId = studentIdInput.value.trim();
        
        // Check if a student ID was entered
        if (!studentId) {
            showMessage('Please enter your ID first!', true); // true for error
            // Uncheck the radio button if ID is missing
            this.checked = false; 
            return;
        }

        // Send input data to server
        try {
            const status = this.value === 'in' ? 'in' : 'out';
            await fetch('/api/checkin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ studentId, status: this.value })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Handle error
                    if (data.error) {
                        showMessage(data.error, true);
                    } else {
                        // Handle success
                        const studentName = data.studentName;
                        showMessage(`Thanks, ${studentName}! You have been checked ${status}.`, false); // false for success
                        console.log(data.message);
                    }
                })
        } catch(error) {
            // Handle error
            showMessage('There was a problem with your request.', true);
        };

        // Optional: Clear the input and reset radio buttons after action
        setTimeout(() => {
            studentIdInput.value = '';
            this.checked = false;
        }, 1500); // Reset after 1.5 seconds
    });
});