# Dozo-diet-planner

Overview
The Dozo Diet Planner is a web-based application designed to create personalized, healthy diet plans based on user input. It calculates daily caloric needs using the Harris-Benedict formula and generates a varied diet plan tailored to the user's profile, preferences, and health conditions.
Purpose
The goal of this program is to assist users in planning balanced diets that align with their weight goals (lose, maintain, or gain), dietary preferences (normal, vegetarian, or vegan), and medical conditions. It ensures nutritional variety while avoiding harmful ingredients based on user-specified restrictions.
Features
•	User Input: Collects details like name, sex, age, weight, height, activity level, weight goal, medical conditions, allergies, diet type, meals per day, and plan duration (1-30 days).
•	Calorie Calculation: Uses the Harris-Benedict formula to determine Basal Metabolic Rate (BMR) and adjusts it based on activity level and weight goals.
•	Diet Customization: Filters foods based on diet type (e.g., vegan excludes meat), medical conditions (e.g., celiac disease excludes bread), and allergies.
•	Meal Planning: Groups foods into carbohydrates, proteins, vegetables, and fruits, with breakfast avoiding typical lunch/dinner items (e.g., rice, beef).
•	Visual Output: Displays a clear, day-by-day diet plan with color-coded days and organized meal cards for easy reading.
•	Validation: Alerts users if input data suggests a health risk, recommending specialist consultation.
How It Works
1.	Input: Users fill out a form with their personal details, preferences, and restrictions.
2.	Processing: The program calculates daily calorie needs and filters a food database to match the user’s profile.
3.	Output: A diet plan is generated and displayed, showing meals for each day with food quantities in grams, organized by category.
Requirements
•	A modern web browser (e.g., Chrome, Firefox, Edge).
•	The following files in the same directory:
o	index.html
o	styles.css
o	script.js
o	logo_dozo.png (replace with any logo image if not available).
How to Run
Option 1: Using Visual Studio Code (Recommended)
1.	Install VS Code: Download and install Visual Studio Code.
2.	Install Live Server Extension:
o	Open VS Code, go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X on Mac).
o	Search for "Live Server" by Ritwick Dey and click "Install".
3.	Open the Project:
o	Open VS Code and select File > Open Folder.
o	Choose the folder containing index.html, styles.css, script.js, and logo_dozo.png.
4.	Launch the App:
o	Right-click index.html in the Explorer pane and select "Open with Live Server".
o	A browser window will open with the application running.
Option 2: Without VS Code
1.	Ensure Files are Ready: Place index.html, styles.css, script.js, and logo_dozo.png in the same folder.
2.	Open in Browser:
o	Double-click index.html to open it in your default web browser.
o	Alternatively, drag index.html into an open browser window.
3.	Use the App: The application will load and function directly in the browser.
Notes
•	If logo_dozo.png is missing, replace it with any image file and update the <img src> path in index.html accordingly.
•	The app runs entirely client-side; no server or internet connection is required beyond initial loading.
•	For abnormal inputs (e.g., weight < 30kg or > 200kg), an alert suggests consulting a specialist.
Future Improvements
•	Add a downloadable PDF version of the diet plan.
•	Expand the food database with more options and nutritional data.
•	Include calorie breakdown per meal.
