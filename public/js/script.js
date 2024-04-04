function addRoutineSidebar() {
    var addRoutineDiv = document.querySelector(".info__addRoutine");
    if (addRoutineDiv.style.display === 'none') {
        addRoutineDiv.style.display = 'block';
    } else {
        addRoutineDiv.style.display = 'none';
    }
}

function showAddRoutine() {
    document.getElementById("info").style.display = "block";
}

function hideAddRoutine() {
    document.getElementById("info").style.display = "none";
}