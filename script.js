// original array of program days with sets for each day and classification of rest days/not 
const PROGRAM = [
  { day: 1, sets: [5, 4, 3, 2, 1], isRest: false },
  { day: 2, sets: [5, 4, 3, 2, 2], isRest: false },
  { day: 3, sets: [5, 4, 3, 3, 2], isRest: false },
  { day: 4, sets: [5, 4, 4, 3, 2], isRest: false },
  { day: 5, sets: [5, 5, 4, 3, 2], isRest: false },
  { day: 6, sets: [], isRest: true },
  { day: 7, sets: [6, 5, 4, 3, 2], isRest: false },
  { day: 8, sets: [6, 5, 4, 3, 3], isRest: false },
  { day: 9, sets: [6, 5, 4, 4, 3], isRest: false },
  { day: 10, sets: [6, 5, 5, 4, 3], isRest: false },
  { day: 11, sets: [6, 6, 5, 4, 3], isRest: false },
  { day: 12, sets: [], isRest: true },
  { day: 13, sets: [7, 6, 5, 4, 3], isRest: false },
  { day: 14, sets: [7, 6, 5, 4, 4], isRest: false },
  { day: 15, sets: [7, 6, 5, 5, 4], isRest: false },
  { day: 16, sets: [7, 6, 6, 5, 4], isRest: false },
  { day: 17, sets: [7, 7, 6, 5, 4], isRest: false },
  { day: 18, sets: [], isRest: true },
  { day: 19, sets: [8, 7, 6, 5, 4], isRest: false },
  { day: 20, sets: [8, 7, 6, 5, 5], isRest: false },
  { day: 21, sets: [8, 7, 6, 6, 5], isRest: false },
  { day: 22, sets: [8, 7, 7, 6, 5], isRest: false },
  { day: 23, sets: [8, 8, 7, 6, 5], isRest: false },
  { day: 24, sets: [], isRest: true },
  {day: 25, sets: [9, 8, 7, 6, 5], isRest: false },
  {day: 26, sets: [9, 8, 7, 6, 6], isRest: false },
  {day: 27, sets: [9, 8, 7, 7, 6], isRest: false },
  {day: 28, sets: [9, 8, 8, 7, 6], isRest: false },
  {day: 29, sets: [9, 9, 8, 7, 6], isRest: false },
  // ...
];


// Function to build the updating log from the program
function buildLogFromProgram() {
  return PROGRAM.map(function(dayData) {
    return {
      day: dayData.day,
      completedDate: null,
      sets: dayData.sets.map(function(reps) { return { reps: reps, completed: false }; }),
      isRest: dayData.isRest
    };
  });
}


function loadLog() {
    const saved = localStorage.getItem('pulluplog');
    if (saved) {
        return JSON.parse(saved);
    } else {
        return buildLogFromProgram();
    }
}

function saveLog(log) {
    localStorage.setItem('pulluplog', JSON.stringify(log) )
}

let LOG = loadLog();




// Function to render the sets for a specific day
function renderDay(dayNumber) {
    const dayData = LOG[dayNumber - 1];
    const titleElement = document.getElementById('day-title');
    titleElement.textContent = `Day ${dayNumber}`;
    

    const statusElement = document.getElementById('status-message');
    statusElement.classList.remove('current-day-status');
    if (dayNumber < activeIndex) {
        statusElement.textContent = "Completed";
    } else if (dayNumber === activeIndex) {
        statusElement.textContent = "Current Day";
        statusElement.classList.add('current-day-status');
    } else {
        statusElement.textContent = "Upcoming";
    }
    
    if (dayData.completedDate) {
        statusElement.textContent += ` (Completed on ${dayData.completedDate})`;
    }

    const setsContainer = document.getElementById('sets-container');
    setsContainer.innerHTML = '';

    //Render the reps per set for the day
    dayData.sets.forEach(function(setObject, index) {
        const setElement = document.createElement('div');
        setElement.textContent = `${setObject.reps}`;
        
        if (setObject.completed) {
            setElement.classList.add('completed');
        }
        

        setElement.addEventListener('click', function() {
            setObject.completed = !setObject.completed;
            setElement.classList.toggle('completed');
            saveLog(LOG);
        });

        
        setsContainer.appendChild(setElement);
    });
}


let activeIndex = 1;
let viewingIndex = 1;

document.getElementById('prev-day').addEventListener('click', function() {
    if (viewingIndex > 1) {viewingIndex--; renderDay(viewingIndex);}
});

document.getElementById('next-day').addEventListener('click', function() {
    if (viewingIndex < LOG.length) {viewingIndex++; renderDay(viewingIndex);}
});

document.getElementById('complete-day').addEventListener('click', function() {
    const dayComplete = LOG[activeIndex - 1].sets.every(set => set.completed === true);
    if (dayComplete) {
        LOG[activeIndex - 1].completedDate = new Date().toLocaleDateString();
        if (activeIndex < LOG.length) {
            activeIndex++;
            
        }
    } else {
        const restDayObj = { day: LOG[activeIndex - 1].day, completedDate: null, sets: [], isRest: true };
        const repeatDayObj = { day: LOG[activeIndex - 1].day, completedDate: null, sets: LOG[activeIndex - 1].sets.map(set => ({ ...set, completed: false })), isRest: false };
        LOG.splice(activeIndex, 0, restDayObj, repeatDayObj);
        activeIndex++;
    }
    viewingIndex = activeIndex;
    saveLog(LOG);
    renderDay(viewingIndex);
});







renderDay(viewingIndex);