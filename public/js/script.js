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

function addSetSidebar(exerciseName, exerciseType, exerciseId, exerciseIndex) {
    var addRoutineDiv = document.querySelector(".info__addRoutine");
    var addExerciseDiv = document.querySelector(".info__addExercise");
    var addSetDiv = document.querySelector(".info__addSet");
    
    console.log(exerciseName, exerciseType, exerciseId);

    // nyari form yang ada di dalam div info__addSet
    document.querySelectorAll('form').forEach(form => {
        const exerciseIdInput = form.querySelector('input[name="exerciseId"]');
        const exerciseIndexInput = form.querySelector('input[name="exerciseIndex"]');
        
        if (exerciseIdInput && exerciseIndexInput) {
            exerciseIdInput.value = exerciseId;
            exerciseIndexInput.value = exerciseIndex;
        }
    });

    // Update exercise name placeholder and display the relevant section
    document.getElementById('exerciseNamePlaceholder').textContent = exerciseName;
    document.getElementById('addSetExerciseId').value = exerciseId;
    document.getElementById('exerciseIndex').value = exerciseIndex;
    
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
        var customExerciseId = this.getAttribute('customExerciseId');
        var routineId = this.getAttribute('routineId');
        var userId = this.getAttribute('userId');
        addExerciseToRoutine(exerciseId, routineId, userId, customExerciseId);
        });
    }

    async function addExerciseToRoutine(exerciseId, routineId, userId, customExerciseId) {
        try {
            const response = await fetch('/addExerciseToRoutine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    exerciseId: exerciseId,
                    customExerciseId: customExerciseId,
                    routineId: routineId,
                    userId: userId,
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to add exercise to routine');
            }
    
            // Extract URL from response
            const { url } = response;
    
            // Redirect to the new URL
            window.location.href = url;
        } catch (error) {
            console.error('Error:', error);
            // Optionally, you can display an error message to the user here
        }
    }
});

function deleteRoutine(routineId, username, userId) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`/deleteRoutine/${routineId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
            // Optionally handle success (e.g., update UI)
            console.log('Item deleted successfully');
            // Redirect to another page if needed
            window.location.href = `/user/${username}/routine?userId=${userId}`;
            } else {
            // Handle non-200 status codes
            console.error('Failed to delete item:', response.statusText);
            alert('Failed to delete item');
            }
        })
        .catch(error => {
          // Handle network errors
            console.error('Error deleting item:', error);
            alert('Error deleting item');
        });
    }
}

function deleteExerciseFromRoutine(routineId, userId, username, index) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`/deleteExerciseFromRoutine/${routineId}/${index}`, {
            method: 'DELETE',
            
        })
        .then(response => {
            if (response.ok) {
            // Optionally handle success (e.g., update UI)
            console.log('Item deleted successfully');
            // Redirect to another page if needed
            window.location.href = `/user/${username}/routine/${routineId}?userId=${userId}`;
            } else {
            // Handle non-200 status codes
            console.error('Failed to delete item:', response.statusText);
            alert('Failed to delete item');
            }
        })
        .catch(error => {
          // Handle network errors
            console.error('Error deleting item:', error);
            alert('Error deleting item');
        });
    }
}

function deleteCustomExercise(customExerciseId, userId, username, routineId) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`/deleteCustomExercise/${customExerciseId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
            // Optionally handle success (e.g., update UI)
            console.log('Item deleted successfully');
            // Redirect to another page if needed
            window.location.href = `/user/${username}/routine/${routineId}?userId=${userId}`;
            } else {
            // Handle non-200 status codes
            console.error('Failed to delete item:', response.statusText);
            alert('Failed to delete item');
            }
        })
        .catch(error => {
          // Handle network errors
            console.error('Error deleting item:', error);
            alert('Error deleting item');
        });
    }
}