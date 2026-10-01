FairShare - Smart Restaurant Bill Splitter 🍽️

A modern, intuitive web application designed to eliminate the awkwardness of splitting restaurant bills among friends. Built with a clean UI and Firebase for history tracking, it handles custom tips, multi-currency support, and itemized exceptions (like when someone skips a starter).

🚀 Repository

GitHub - crazxy851/Chaos-Engineering

✨ Features

Smart Bill Splitting: Divide the total bill effortlessly among any number of people.

Itemized Deductions (Who Ate What?): Add specific items (like a shared starter or an expensive drink) and assign them to specific people so everyone pays exactly their fair share.

Flexible Tipping: Quick-select tip percentages (5%, 10%, 15%, 20%) or enter a custom amount.

Multi-Currency Support: Switch between popular currencies dynamically ($, €, £, ₹).

Persistent History: Saves your past split bills along with the restaurant name securely using Firebase, so you can always check who owes what later.

Responsive Design: Beautiful, mobile-friendly card-based UI.

📁 Project Structure

The application has been refactored for better maintainability and separation of concerns:

index.html: Contains the core structure and layout of the application.

style.css: Custom styling, responsive rules, and UI enhancements.

script.js: Handles all the application logic, mathematical calculations, UI interactivity, and Firebase integration.

🛠️ Tech Stack

Frontend: HTML5, CSS3, Vanilla JavaScript

Styling: Tailwind CSS (via CDN) & Custom CSS (style.css)

Database: Firebase Realtime Database / Firestore (for tracking history)

Icons: FontAwesome / Inline SVGs

💻 Getting Started

Prerequisites

All you need is a modern web browser. No complex build tools or Node.js environment is required to run the application locally.

Installation

Clone the repository:

git clone https://github.com/crazxy851/Chaos-Engineering.git


Navigate into the project directory:

cd Chaos-Engineering


Open the index.html file in your preferred web browser.

🔧 Firebase Configuration (For History Feature)

To enable the History tracking feature, you need to connect your own Firebase backend:

Go to the Firebase Console.

Create a new project and register a web app.

Copy your Firebase config object.

Replace the placeholder Firebase configuration inside your script.js file with your actual credentials.

💡 How to Use

Enter the Restaurant Name and select your preferred Currency.

Input the Total Bill Amount and the Number of People.

Select or enter a Tip Percentage.

(Optional) Use the Itemized Breakdowns section if someone ordered something extra or skipped a dish. Specify the item cost and how many people shared it.

Click Calculate Final Split to generate a clean breakdown of exactly how much each person owes.

🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

📝 License

This project is open-source and available under the MIT License.
