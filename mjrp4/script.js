document.addEventListener('DOMContentLoaded', () => {

    // 1. Animate on Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // 2. Copy Code Button
    const copyBtn = document.querySelector('.copy-btn');
    const codeBlock = document.querySelector('.code-container code');
    if (copyBtn && codeBlock) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(codeBlock.innerText).then(() => {
                copyBtn.innerHTML = '<i class="fas fa-check"></i> تم النسخ!';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> نسخ الشفرة';
                }, 2000);
            });
        });
    }

    // 3. Sequential Interactive Quiz
    const quizView = document.getElementById('quiz-view');
    const quizResultsView = document.getElementById('quiz-results-view');
    const quizDataStorage = document.getElementById('quiz-data-storage');

    const questionTextEl = document.getElementById('quiz-question-text');
    const optionsContainerEl = document.getElementById('quiz-options-container');
    const feedbackEl = document.getElementById('quiz-feedback');
    const progressEl = document.getElementById('quiz-progress');
    const nextBtn = document.getElementById('quiz-next-btn');
    const retryBtn = document.getElementById('quiz-retry-btn');

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    function initializeQuiz() {
        const questionItems = quizDataStorage.querySelectorAll('.quiz-item');
        questions = Array.from(questionItems).map(item => ({
            question: item.dataset.question,
            options: JSON.parse(item.dataset.options),
            correctIndex: parseInt(item.dataset.correctIndex, 10)
        }));
        startQuiz();
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        quizResultsView.style.display = 'none';
        quizView.style.display = 'block';
        showQuestion(currentQuestionIndex);
    }

    function showQuestion(index) {
        if (index >= questions.length) {
            showResults();
            return;
        }

        const question = questions[index];
        questionTextEl.textContent = question.question;
        optionsContainerEl.innerHTML = '';
        feedbackEl.textContent = '';
        nextBtn.style.display = 'none';
        progressEl.textContent = `السؤال ${index + 1} من ${questions.length}`;

        question.options.forEach((option, i) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => selectAnswer(i, button));
            optionsContainerEl.appendChild(button);
        });
    }

    function selectAnswer(selectedIndex, selectedButton) {
        const question = questions[currentQuestionIndex];
        const correct = selectedIndex === question.correctIndex;

        if (correct) {
            score++;
            feedbackEl.textContent = 'إجابة صحيحة!';
            feedbackEl.style.color = '#28a745';
        } else {
            feedbackEl.textContent = 'إجابة خاطئة.';
            feedbackEl.style.color = '#dc3545';
        }

        Array.from(optionsContainerEl.children).forEach((button, i) => {
            button.disabled = true;
            if (i === question.correctIndex) {
                button.classList.add('correct');
            } else if (i === selectedIndex) {
                button.classList.add('wrong');
            }
        });

        nextBtn.style.display = 'inline-block';
    }

    function showResults() {
        quizView.style.display = 'none';
        quizResultsView.style.display = 'block';

        document.getElementById('quiz-score').textContent = score;
        document.getElementById('quiz-total').textContent = questions.length;
        const percentage = Math.round((score / questions.length) * 100);
        document.getElementById('quiz-percentage').textContent = `${percentage}%`;
    }

    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    });

    retryBtn.addEventListener('click', startQuiz);

    // Start the quiz when the page loads
    initializeQuiz();
});
