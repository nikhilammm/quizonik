


// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let answeredQuestions = [];
let isQuizComplete = false;

// DOM elements
const questionsContainer = document.getElementById('questions-container');
const scoreDisplay = document.getElementById('val-score');
const correctDisplay = document.getElementById('val-correct');
const wrongDisplay = document.getElementById('val-wrong');
const remainDisplay = document.getElementById('val-remain');
const quiz_title = document.getElementById('quiz_title');
const doc_title = document.querySelector("title");

// Initialize quiz
function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    answeredQuestions = [];
    isQuizComplete = false;
    renderQuestions();
    updateScoreBoard();
}

// Render all questions
function renderQuestions() {
    questionsContainer.innerHTML = '';
    doc_title.innerHTML = quizData.quiz_title;
    quiz_title.innerHTML = quizData.quiz_title;

    
    quizData.questions.forEach((q, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.id = `question-${index}`;
        
        // Check if this question has been answered
        const isAnswered = answeredQuestions[index] !== undefined;
        const selectedOption = isAnswered ? answeredQuestions[index] : null;
        const isCorrect = isAnswered ? selectedOption === q.answer : null;
        







        // Create question HTML
        let optionsHTML = '';
q.options.forEach((option, optIndex) => {
    let optionClass = 'option';
    let feedbackHTML = '';
    let hoverFeedback = '';
    
    if (isAnswered) {
        optionClass += ' answered';
        
        if (optIndex === q.answer) {
            optionClass += ' show-correct';
        }
        
        if (optIndex === selectedOption && optIndex !== q.answer) {
            optionClass += ' user-wrong';
        }
        
        // Add feedback text for hover (for all options)
        hoverFeedback = `<div class="feedback-hover">${q.feedback[optIndex]}</div>`;
        
        // Show inline feedback only for selected or correct answer (as before)
        if (optIndex === selectedOption) {
            feedbackHTML = `<div class="feedback-text">${q.feedback[optIndex]}</div>`;
        } else if (optIndex === q.answer && selectedOption !== q.answer) {
            feedbackHTML = `<div class="feedback-text">${q.feedback[optIndex]}</div>`;
        }
    }
    
    optionsHTML += `
        <div class="${optionClass}" data-question="${index}" data-option="${optIndex}">
            <div class="option-content">
                <span class="chk"></span>
                <span>${option}</span>
            </div>
            ${feedbackHTML}
            ${hoverFeedback}
        </div>
    `;
});
        
        // Create submit button for this question
        const submitButtonHTML = `
            <div class="btn-submit-container">
                <button class="btn-submit" data-question="${index}" ${isAnswered ? 'disabled' : ' style="display:none"'}>
                    ${isAnswered ? 'Answered ✓' : 'Submit Answer'}
                </button>
            </div>
        `;
        
        questionCard.innerHTML = `
            <div class="q-header">Question ${index + 1} of ${quizData.questions.length}</div>
            <div class="q-body">${q.question}</div>
            <div class="q-answers">
                ${optionsHTML}
            </div>
            ${submitButtonHTML}
        `;
        
        questionsContainer.appendChild(questionCard);
    });
    
    // Add event listeners to options
    document.querySelectorAll('.option:not(.answered)').forEach(option => {
        option.addEventListener('click', function() {
            const questionIndex = parseInt(this.dataset.question);
            const optionIndex = parseInt(this.dataset.option);
            
            // Remove selection from other options in same question
            const parentCard = this.closest('.question-card');
            parentCard.querySelectorAll('.option:not(.answered)').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Select this option
            this.classList.add('selected');
            // Enable submit button
            const submitBtn = parentCard.querySelector('.btn-submit');
            if (submitBtn) {
                submitBtn.style.display = "block";
            }
        });
    });
    
    // Add event listeners to submit buttons
    document.querySelectorAll('.btn-submit:not([disabled])').forEach(btn => {
        btn.addEventListener('click', function() {
            const questionIndex = parseInt(this.dataset.question);
            submitAnswer(questionIndex);
        });
    });
}




// Submit answer for a specific question
function submitAnswer(questionIndex) {
    if (answeredQuestions[questionIndex] !== undefined) {
        return; // Already answered
    }
    
    const questionCard = document.getElementById(`question-${questionIndex}`);
    const selectedOption = questionCard.querySelector('.option.selected');
    const submitBtn = questionCard.querySelector('.btn-submit');

    
    if (!selectedOption) {
        return;
    }
    
    const selectedIndex = parseInt(selectedOption.dataset.option);
    const question = quizData.questions[questionIndex];
    const isCorrect = selectedIndex === question.answer;
    
    // Store answer
    answeredQuestions[questionIndex] = selectedIndex;
    
    // Update scores
    if (isCorrect) {
        correctCount++;
    } else {
        wrongCount++;
    }
    
    // Update score percentage
    const totalAnswered = correctCount + wrongCount;
    score = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    
    // Update UI for this question
    const allOptions = questionCard.querySelectorAll('.option');
    
    allOptions.forEach((opt, index) => {
        opt.classList.add('answered');
        opt.classList.remove('selected');
        
        if (index === question.answer) {
            opt.classList.add('show-correct');
            // Add feedback for correct answer
            const feedbackDiv = opt.querySelector('.feedback-text');
            if (feedbackDiv) {
                feedbackDiv.textContent = question.feedback[index];
                feedbackDiv.style.display = 'block';
            } else {
                const feedbackHTML = `<div class="feedback-text">${question.feedback[index]}</div>`;
                opt.insertAdjacentHTML('beforeend', feedbackHTML);
            }
        }
        
        if (index === selectedIndex && index !== question.answer) {
            opt.classList.add('user-wrong');
            // Add feedback for wrong answer
            const feedbackDiv = opt.querySelector('.feedback-text');
            if (feedbackDiv) {
                feedbackDiv.textContent = question.feedback[index];
                feedbackDiv.style.display = 'block';
            } else {
                const feedbackHTML = `<div class="feedback-text">${question.feedback[index]}</div>`;
                opt.insertAdjacentHTML('beforeend', feedbackHTML);
            }
        }
    });
    
    // After disabling submit button
submitBtn.disabled = true;
submitBtn.textContent = 'Answered ✓';

// Add hover feedback to all options of this question
allOptions.forEach((opt, index) => {
    // Check if hover feedback already exists
    if (!opt.querySelector('.feedback-hover')) {
        // opt.classList.add('user-wrong');
        const hoverDiv = document.createElement('div');
        hoverDiv.className = 'feedback-hover';
        hoverDiv.innerHTML = question.feedback[index];        
        opt.appendChild(hoverDiv);
    }
});
    
    // Update score board
    updateScoreBoard();
    
    // Check if all questions are answered
    checkQuizComplete();
}


// Update score board
function updateScoreBoard() {
    const totalQuestions = quizData.questions.length;
    const answered = correctCount + wrongCount;
    const remaining = totalQuestions - answered;
    
    scoreDisplay.textContent = `${score}%`;
    correctDisplay.textContent = correctCount;
    wrongDisplay.textContent = wrongCount;
    remainDisplay.textContent = remaining;
}

// Check if quiz is complete
function checkQuizComplete() {
    const totalQuestions = quizData.questions.length;
    const answered = correctCount + wrongCount;
    
    if (answered === totalQuestions) {
        isQuizComplete = true;
        // You could add celebration or completion message here if desired
        console.log('Quiz completed!');
    }
}

// Reset quiz

const resetModal = document.querySelector("#resetModal");
const resetBtn = document.querySelector("#resetModalBtn");
    resetBtn.addEventListener('click', ()=>{
        resetModal.close();
        // Reset all state
        currentQuestionIndex = 0;
        score = 0;
        correctCount = 0;
        wrongCount = 0;
        answeredQuestions = [];
        isQuizComplete = false;
        
        // Re-render questions
        renderQuestions();
        updateScoreBoard();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })


// Initialize quiz when page loads
// document.addEventListener('DOMContentLoaded', initQuiz);
initQuiz();