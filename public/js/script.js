
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

function addExerciseSidebar() {
    var addRoutineDiv = document.querySelector(".info__addRoutine");
    var addExerciseDiv = document.querySelector(".info__addExercise");

    if (addExerciseDiv.style.display === 'none') {
        addRoutineDiv.style.display = 'none';
        addExerciseDiv.style.display = 'block'; 
    } else {
        addExerciseDiv.style.display = 'none';
    }
}
