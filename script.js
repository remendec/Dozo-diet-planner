// Asegurarse de que el DOM esté completamente cargado antes de asignar eventos
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos del DOM con depuración
    const formElement = document.getElementById('dietForm');
    const resetButton = document.getElementById('reset');
    const resultDiv = document.getElementById('result');

    // Depuración: Verificar el elemento del formulario
    console.log('Form element:', formElement);
    if (!formElement) {
        console.error('Error: No se encontró un elemento con ID "dietForm". Verifica el HTML.');
        return;
    }
    if (!(formElement instanceof HTMLFormElement)) {
        console.error('Error: El elemento con ID "dietForm" no es un <form>. Verifica la estructura HTML.');
        return;
    }

    // Evento de envío del formulario
    formElement.addEventListener('submit', function(e) {
        e.preventDefault();
        generateDiet();
    });

    // Evento de reinicio con fallback
    resetButton.addEventListener('click', function() {
        console.log('Reset button clicked'); // Depuración

        try {
            formElement.reset(); // Intenta usar el método reset()
            resultDiv.innerHTML = ''; // Limpia el resultado
            console.log('Form reset and result cleared successfully'); // Depuración
        } catch (error) {
            console.error('Error al usar form.reset:', error);
            // Fallback: Reiniciar manualmente los campos
            const inputs = formElement.querySelectorAll('input, select');
            inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
            resultDiv.innerHTML = ''; // Limpia el resultado
            console.log('Fallback: Form fields reset manually and result cleared');
        }
    });
});

// Base de datos de alimentos
const foods = {
    carbs: {
        all: ['Rice', 'Oats', 'Potato', 'Quinoa', 'Bread'],
        breakfast: ['Oats', 'Bread']
    },
    proteins: {
        all: ['Chicken', 'Beef', 'Fish', 'Eggs', 'Tofu', 'Lentils'],
        breakfast: ['Eggs', 'Tofu']
    },
    vegetables: ['Broccoli', 'Spinach', 'Carrot', 'Zucchini', 'Tomato'],
    fruits: ['Apple', 'Banana', 'Orange', 'Strawberry', 'Blueberry'],
    snacks: ['Almonds', 'Walnuts', 'Dried Apricots', 'Banana Chips', 'Apple Slices']
};

function calculateBMR(sex, weight, height, age) {
    if (sex === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
}

function getActivityMultiplier(activity) {
    const levels = { low: 1.2, light: 1.375, moderate: 1.55, high: 1.725, intense: 1.9 };
    return levels[activity] || 1.2;
}

function adjustCalories(bmr, goal) {
    if (goal === 'lose') return bmr - 500;
    if (goal === 'gain') return bmr + 500;
    return bmr;
}

function filterFoods(conditions, dietType, allergies) {
    let filtered = {
        carbs: { all: [...foods.carbs.all], breakfast: [...foods.carbs.breakfast] },
        proteins: { all: [...foods.proteins.all], breakfast: [...foods.proteins.breakfast] },
        vegetables: [...foods.vegetables],
        fruits: [...foods.fruits],
        snacks: [...foods.snacks]
    };
    if (dietType === 'vegetarian') {
        filtered.proteins.all = filtered.proteins.all.filter(p => !['Chicken', 'Beef', 'Fish'].includes(p));
        filtered.proteins.breakfast = filtered.proteins.breakfast.filter(p => !['Chicken', 'Beef', 'Fish'].includes(p));
    }
    if (dietType === 'vegan') {
        filtered.proteins.all = ['Tofu', 'Lentils'];
        filtered.proteins.breakfast = ['Tofu'];
        filtered.snacks = filtered.snacks.filter(s => !['Almonds', 'Walnuts'].includes(s));
    }
    if (conditions.includes('lactose')) {
        filtered.proteins.all = filtered.proteins.all.filter(p => p !== 'Eggs');
        filtered.proteins.breakfast = filtered.proteins.breakfast.filter(p => p !== 'Eggs');
    }
    if (conditions.includes('celiac')) {
        filtered.carbs.all = filtered.carbs.all.filter(c => c !== 'Bread');
        filtered.carbs.breakfast = filtered.carbs.breakfast.filter(c => c !== 'Bread');
    }
    if (allergies) {
        const allergyList = allergies.split(',').map(a => a.trim());
        for (let category in filtered) {
            if (category === 'carbs' || category === 'proteins') {
                filtered[category].all = filtered[category].all.filter(f => !allergyList.includes(f));
                filtered[category].breakfast = filtered[category].breakfast.filter(f => !allergyList.includes(f));
            } else {
                filtered[category] = filtered[category].filter(f => !allergyList.includes(f));
            }
        }
    }
    return filtered;
}

function generateDiet() {
    const name = document.getElementById('name').value;
    const sex = document.getElementById('sex').value;
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseInt(document.getElementById('height').value);
    const activity = document.getElementById('activity').value;
    const goal = document.getElementById('goal').value;
    const conditions = Array.from(document.querySelectorAll('input[name="condition"]:checked')).map(c => c.value);
    const allergies = document.getElementById('allergies').value;
    const dietType = document.getElementById('dietType').value;
    const meals = Array.from(document.querySelectorAll('input[name="meal"]:checked')).map(m => m.value);
    const days = parseInt(document.getElementById('days').value);

    // Validación de datos
    if (weight < 30 || weight > 200 || height < 100 || height > 250 || age < 10 || age > 100) {
        document.getElementById('result').innerHTML = '<p class="alert">Your case requires the assistance of a specialist.</p>';
        return;
    }

    // Cálculo de calorías
    const bmr = calculateBMR(sex, weight, height, age);
    const tdee = bmr * getActivityMultiplier(activity);
    const calories = adjustCalories(tdee, goal);
    const mainMealsCount = meals.filter(m => !['firstSnack', 'secondSnack'].includes(m)).length;
    const snackCalories = 100;
    const mainMealCalories = (calories - (meals.includes('firstSnack') ? snackCalories : 0) - (meals.includes('secondSnack') ? snackCalories : 0)) / (mainMealsCount || 1);

    // Filtrar alimentos
    const availableFoods = filterFoods(conditions, dietType, allergies);

    // Generar dieta
    let result = `
        <h2>Diet Plan for ${name}</h2>
        <p class="summary"><strong>Total Days:</strong> ${days} | <strong>Daily Calories:</strong> ${Math.round(calories)} kcal</p>
        <div class="diet-plan">
    `;
    
    for (let day = 1; day <= days; day++) {
        const dayClass = day % 2 === 0 ? 'day-even' : 'day-odd';
        result += `
            <section class="day-section ${dayClass}">
                <h3>Day ${day}</h3>
                <div class="meal-grid">
        `;
        meals.forEach(meal => {
            const isBreakfast = meal === 'breakfast';
            const isSnack = meal === 'firstSnack' || meal === 'secondSnack';
            result += `
                <div class="meal-card ${isSnack ? 'snack-card' : ''}">
                    <h4>${meal.charAt(0).toUpperCase() + meal.slice(1)}</h4>
            `;

            if (isSnack) {
                result += `
                    <div class="food-category">
                        <span>Snack:</span>
                        <ul>
                            <li>${availableFoods.snacks[day % availableFoods.snacks.length]} - 30g</li>
                        </ul>
                    </div>
                `;
            } else {
                result += `
                    <div class="food-category">
                        <span>Carbohydrates:</span>
                        <ul>
                            <li>${isBreakfast ? availableFoods.carbs.breakfast[day % availableFoods.carbs.breakfast.length] : availableFoods.carbs.all[day % availableFoods.carbs.all.length]} - ${isBreakfast ? 50 : 100}g</li>
                        </ul>
                    </div>
                    <div class="food-category">
                        <span>Proteins:</span>
                        <ul>
                            <li>${isBreakfast ? availableFoods.proteins.breakfast[day % availableFoods.proteins.breakfast.length] : availableFoods.proteins.all[day % availableFoods.proteins.all.length]} - ${isBreakfast ? 30 : 80}g</li>
                        </ul>
                    </div>
                    <div class="food-category">
                        <span>Vegetables:</span>
                        <ul>
                            <li>${availableFoods.vegetables[day % availableFoods.vegetables.length]} - 100g</li>
                        </ul>
                    </div>
                    <div class="food-category">
                        <span>Fruits:</span>
                        <ul>
                            <li>${availableFoods.fruits[day % availableFoods.fruits.length]} - 150g</li>
                        </ul>
                    </div>
                `;
            }
            result += `</div>`;
        });
        result += `
                </div>
            </section>
        `;
    }
    
    result += `</div>`;
    document.getElementById('result').innerHTML = result;
}