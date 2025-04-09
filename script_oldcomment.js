// Clock animation variables
let lastUpdateTime = 0;
let currentSecond = 0;
let currentMinute = 0;
let currentHour = 0;
let currentBackHour = 0;
let currentForwardHour = 0;

// Message button variables
const messages = [
    "Hi Mom!",
    "Love You!",
    "Have a Good Day :)",
    "Miss You!",
    "🌸 🌼 🌷 🌹 💐 🌻 🌹 🌷 🌼 🌸"
];
let currentMessagePopup = null;
let currentMessageIndex = null;

function updateClock() {
    let currentDate = new Date();
    let timeInHour = currentDate.getHours();
    let timeInMinutes = currentDate.getMinutes();
    let timeInSeconds = currentDate.getSeconds();

    // Calculate the positions for the hands (modified for 24-hour clock)
    // In a 24-hour clock, each hour represents 15 degrees (360/24)
    // Offset by 180 degrees to put 12PM at the top and 12AM at the bottom
    let hourPosition = (timeInHour >= 12) ? timeInHour - 12 : timeInHour + 12;
    let hourHandTurn = (15 * hourPosition + timeInMinutes / 4) % 360;
    
    // Calculate positions for minute and second hands (unchanged)
    let minuteHandTurn = 6 * timeInMinutes;
    let secondHandTurn = 6 * timeInSeconds;
    
    // Calculate the positions for the new hands (2 hours behind and 7 hours ahead)
    // For the back hand (2 hours behind)
    let backHourPosition = ((timeInHour - 2) >= 12) ? (timeInHour - 2) - 12 : (timeInHour - 2) + 12;
    if (backHourPosition < 0) backHourPosition += 24;
    let hourBackHandTurn = (15 * backHourPosition + timeInMinutes / 4) % 360;
    
    // For forward hand (7 hours ahead)
    let forwardHourPosition = ((timeInHour + 10) >= 12) ? (timeInHour + 6) - 12 : (timeInHour + 6) + 12;
    if (forwardHourPosition >= 24) forwardHourPosition -= 24;
    let hourForwardHandTurn = (15 * forwardHourPosition + timeInMinutes / 4) % 360;

    // Animate the hour hand smoothly
    const hourDelta = (hourHandTurn - currentHour) % 360;
    if (hourDelta < -180) {
        currentHour += (hourDelta + 360) / 60;
    } else if (hourDelta > 180) {
        currentHour += (hourDelta - 360) / 60;
    } else {
        currentHour += hourDelta / 60;
    }
    document.getElementById('hour_hand').style.transform = `rotate(${currentHour}deg)`;

    // Animate the minute hand smoothly
    const minuteDelta = (minuteHandTurn - currentMinute) % 360;
    if (minuteDelta < -180) {
        currentMinute += (minuteDelta + 360) / 60;
    } else if (minuteDelta > 180) {
        currentMinute += (minuteDelta - 360) / 60;
    } else {
        currentMinute += minuteDelta / 60;
    }
    document.getElementById('min_hand').style.transform = `rotate(${currentMinute}deg)`;

    // Animate the second hand smoothly
    const secondDelta = (secondHandTurn - currentSecond) % 360;
    if (secondDelta < -180) {
        currentSecond += (secondDelta + 360) / 60;
    } else if (secondDelta > 180) {
        currentSecond += (secondDelta - 360) / 60;
    } else {
        currentSecond += secondDelta / 60;
    }
    document.getElementById('sec_hand').style.transform = `rotate(${currentSecond}deg)`;

    // Animate the 2 hours behind hand smoothly
    const backHourDelta = (hourBackHandTurn - currentBackHour) % 360;
    if (backHourDelta < -180) {
        currentBackHour += (backHourDelta + 360) / 60;
    } else if (backHourDelta > 180) {
        currentBackHour += (backHourDelta - 360) / 60;
    } else {
        currentBackHour += backHourDelta / 60;
    }
    document.getElementById('hour_backhand').style.transform = `rotate(${currentBackHour}deg)`;

    // Animate the 7 hours ahead hand smoothly
    const forwardHourDelta = (hourForwardHandTurn - currentForwardHour) % 360;
    if (forwardHourDelta < -180) {
        currentForwardHour += (forwardHourDelta + 360) / 60;
    } else if (forwardHourDelta > 180) {
        currentForwardHour += (forwardHourDelta - 360) / 60;
    } else {
        currentForwardHour += forwardHourDelta / 60;
    }
    document.getElementById('hour_forwardhand').style.transform = `rotate(${currentForwardHour}deg)`;

    // Request the next frame for the animation
    requestAnimationFrame(updateClock);
}

// Helper function to get rotation in degrees from element
function getRotationDegrees(element) {
    const style = window.getComputedStyle(element);
    const transform = style.getPropertyValue('transform');
    
    if (transform === 'none') return 0;
    
    const matrix = transform.match(/^matrix\((.+)\)$/);
    if (matrix) {
        const values = matrix[1].split(', ');
        return Math.round(Math.atan2(values[1], values[0]) * (180/Math.PI));
    }
    return 0;
}

// Function to update dot colors based on position
function updateDotColors() {
    // Get all the dot elements
    const hourDot = document.querySelector('.hour_dot');
    const backHourDot = document.querySelector('.back_hour_dot');
    const forwardHourDot = document.querySelector('.forward_hour_dot');
    
    // Get rotation of hands
    const hourRotation = getRotationDegrees(document.getElementById('hour_hand'));
    const backHourRotation = getRotationDegrees(document.getElementById('hour_backhand'));
    const forwardHourRotation = getRotationDegrees(document.getElementById('hour_forwardhand'));
    
    // Calculate color based on position (0° = top = white, 180° = bottom = black)
    function calculateColor(rotation) {
        // Normalize the angle to 0-360
        let normalizedAngle = rotation % 360;
        if (normalizedAngle < 0) normalizedAngle += 360;
        
        // Calculate how "far down" the dot is (0 = top, 1 = bottom)
        // Use cosine function directly (not absolute value):
        // At 0° (top) -> cos(0°) = 1 -> colorValue = 255 (white)
        // At 180° (bottom) -> cos(180°) = -1 -> colorValue = 0 (black)
        const positionFactor = (Math.cos(normalizedAngle * Math.PI / 180) + 1) / 2;
        
        // Calculate RGB value (255 = white, 0 = black)
        const colorValue = Math.round(255 * positionFactor);
        
        return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
    }
    
    // Apply the colors
    if (hourDot) hourDot.style.backgroundColor = calculateColor(hourRotation);
    if (backHourDot) backHourDot.style.backgroundColor = calculateColor(backHourRotation);
    if (forwardHourDot) forwardHourDot.style.backgroundColor = calculateColor(forwardHourRotation);
    
    // Continue animation
    requestAnimationFrame(updateDotColors);
}

// Function to check if time is within allowed calling hours
function updateCallButtonStates() {
    // Get current date and time directly
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    
    // Calculate Erin's time (6 hours ahead based on the original code's forward hand calculation)
    let erinHour = (currentHour + 6) % 24;
    
    // Check if Kevin is available (9am-10pm, which is 9-22 in 24-hour format)
    const isKevinAvailable = currentHour >= 9 && currentHour < 22;
    
    // Check if Erin is available (7am-7pm, which is 7-19 in 24-hour format)
    const isErinAvailable = erinHour >= 7 && erinHour < 19;
    
    // Get the buttons
    const kevinButton = document.getElementById('call-kevin-btn');
    const erinButton = document.getElementById('call-erin-btn');
    
    // Update button states
    if (kevinButton) {
        kevinButton.disabled = !isKevinAvailable;
        
        // Add click handlers if enabled
        if (isKevinAvailable) {
            kevinButton.onclick = function() {
                // Replace with Kevin's phone number (with country code, no spaces or symbols)
                window.open("https://wa.me/18015972033", "_blank");
            };
        } else {
            kevinButton.onclick = null;
        }
    }

    if (erinButton) {
        erinButton.disabled = !isErinAvailable;
        
        // Add click handlers if enabled
        if (isErinAvailable) {
            erinButton.onclick = function() {
                // Replace with Erin's phone number (with country code, no spaces or symbols)
                window.open("https://wa.me/18015971665", "_blank");
            };
        } else {
            erinButton.onclick = null;
        }
    }
    
    // Request next animation frame
    requestAnimationFrame(updateCallButtonStates);
}

// Function to display a message
function showMessage(messageIndex = null) {
    // Remove any existing popup
    if (currentMessagePopup) {
        document.body.removeChild(currentMessagePopup);
        currentMessagePopup = null;
    }
    
    // If no index provided, get a random message from the array
    if (messageIndex === null) {
        messageIndex = Math.floor(Math.random() * messages.length);
    }
    
    const message = messages[messageIndex];
    currentMessageIndex = messageIndex;
    
    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'message-popup';
    popup.textContent = message;
    
    // Add to document
    document.body.appendChild(popup);
    
    // Store reference
    currentMessagePopup = popup;
}

// Function to set up the message button - now it's the top left button
function setupMessageButton() {
    const messageBtn = document.getElementById('message-btn');
    if (messageBtn) {
        // Remove any "available" text from the button
        if (messageBtn.textContent.includes("available")) {
            messageBtn.textContent = messageBtn.textContent.replace(/available/gi, "").trim();
        }
        
        messageBtn.addEventListener('click', function() {
            // Find the next message index (different from current)
            let nextIndex = currentMessageIndex;
            if (messages.length > 1) {
                do {
                    nextIndex = Math.floor(Math.random() * messages.length);
                } while (nextIndex === currentMessageIndex);
            }
            
            showMessage(nextIndex);
        });
    }
}

// Load a random message when the page is loaded
function loadRandomMessageOnPageLoad() {
    // Generate a random index from the messages array
    const randomIndex = Math.floor(Math.random() * messages.length);
    
    // Show the message (will remain visible until page reload)
    showMessage(randomIndex);
}

// Start all animation loops
requestAnimationFrame(updateClock);
requestAnimationFrame(updateDotColors);

// Initialize the message button and show a random message on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize button updates
    requestAnimationFrame(updateCallButtonStates);
    
    // Set up message button
    setupMessageButton();
    
    // Show a random message when page loads
    loadRandomMessageOnPageLoad();
});