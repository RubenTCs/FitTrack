function addRoutineSidebar() {
    var addRoutineDiv = document.querySelector(".info__addRoutine");
    var addExerciseDiv = document.querySelector(".info__addExercise");
    var addSetDiv = document.querySelector(".info__addSet");

    if (addRoutineDiv.style.display === 'none') {
        addRoutineDiv.style.display = 'block';
        addExerciseDiv.style.display = 'none'; 
        addSetDiv.style.display = 'none';
    } else {
        addRoutineDiv.style.display = 'none';
    }
}

function addExerciseSidebar() {
    var addRoutineDiv = document.querySelector(".info__addRoutine");
    var addExerciseDiv = document.querySelector(".info__addExercise");
    var addSetDiv = document.querySelector(".info__addSet");

    if (addExerciseDiv.style.display === 'none') {
        addRoutineDiv.style.display = 'none';
        addSetDiv.style.display = 'none';
        addExerciseDiv.style.display = 'block'; 
    } else {
        addExerciseDiv.style.display = 'none';
    }
}

function addSetSidebar(exerciseName, exerciseType) {
    var addRoutineDiv = document.querySelector(".info__addRoutine");
    var addExerciseDiv = document.querySelector(".info__addExercise");
    var addSetDiv = document.querySelector(".info__addSet");

    document.getElementById('exerciseNamePlaceholder').textContent = exerciseName;


    if (addSetDiv.style.display === 'none') {
        addRoutineDiv.style.display = 'none';
        addExerciseDiv.style.display = 'none'; 
        addSetDiv.style.display = 'block';

    }

    document.getElementById('addSetRepsSection').style.display = 'none';
    document.getElementById('addSetDurationSection').style.display = 'none';
    document.getElementById('addSetRepsOnlySection').style.display = 'none';


    if (exerciseType === 'reps') {
        document.getElementById('addSetRepsSection').style.display = 'block';
    } else if (exerciseType === 'duration') {
        document.getElementById('addSetDurationSection').style.display = 'block';
    } else if (exerciseType === 'repsOnly') {
        document.getElementById('addSetRepsOnlySection').style.display = 'block';
    } else if (exerciseType === 'distanceDuration') {
        document.getElementById('addSetDistanceDurationSection').style.display = 'block';
    } else if (exerciseType === 'kgDistance') {
        document.getElementById('addSetKgDistanceSection').style.display = 'block';
    } else if (exerciseType === 'repsPlusKg') {
        document.getElementById('addSetRepsPlusKgSection').style.display = 'block';
    } else if (exerciseType === 'repsMinusKg') {
        document.getElementById('addSetRepsMinusKgSection').style.display = 'block';
    }
}

function showCustomExercise(){
    var customExerciseDiv = document.querySelector(".customExercise");
    var dbAddExerciseDiv = document.querySelector(".dbExercise");

    if (customExerciseDiv.style.display === 'none') {
        customExerciseDiv.style.display = 'block';
        dbAddExerciseDiv.style.display = 'none';

    } else {
        customExerciseDiv.style.display = 'none';
    }
}
function showExerciseDB(){
    var customExerciseDiv = document.querySelector(".customExercise");
    var dbAddExerciseDiv = document.querySelector(".dbExercise");

    if (dbAddExerciseDiv.style.display === 'none') {
        customExerciseDiv.style.display = 'none';
        dbAddExerciseDiv.style.display = 'block';

    } else {
        dbAddExerciseDiv.style.display = 'none';
    }

}

document.addEventListener('DOMContentLoaded', function() {
    var input = document.getElementById('searchInput');
    var ul = document.getElementById('searchList');
    var li = ul.getElementsByTagName('li');
    
    input.addEventListener('input', function() {
        var filter = input.value.toLowerCase();
        for (var i = 0; i < li.length; i++) {
        var text = li[i].textContent.toLowerCase();
        if (text.includes(filter)) {
            li[i].style.display = '';
        } else {
            li[i].style.display = 'none';
        }
        }
    });

    for (var i = 0; i < li.length; i++) {
        li[i].addEventListener('click', function() {
        var exerciseId = this.getAttribute('exerciseId');
        var routineId = this.getAttribute('routineId');
        var userId = this.getAttribute('userId');
        addExerciseToRoutine(exerciseId, routineId, userId);
        });
    }

    function addExerciseToRoutine(exerciseId, routineId, userId) {
        console.log(exerciseId, routineId, userId)
      // Send a POST request to the server to update the routine with the selected exercise
        fetch('/addExerciseToRoutine', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            exerciseId: exerciseId,
            routineId: routineId,
            userId: userId,
        })
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add exercise to routine');
        }
        // console.log(response.url);
        window.location.href = response.url;
        })
        .catch(error => {
        console.error('Error:', error);
        // Optionally, you can display an error message to the user here
        });
    }
});

