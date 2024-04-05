const { response } = require("express");

function addRoutineSidebar() {
    var addRoutineDiv = document.querySelector(".info__addRoutine");
    var addExerciseDiv = document.querySelector(".info__addExercise");

    if (addRoutineDiv.style.display === 'none') {
        addRoutineDiv.style.display = 'block';
        addExerciseDiv.style.display = 'none'; 
    } else {
        addRoutineDiv.style.display = 'none';
    }
}

function displayRoutine(routineId) {
    fetch(`/<%= username %>/routines/${routineId}`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('routineDetails').innerHTML = html;
        })
        .catch(error => console.error('Error fetching routine:', error));
}