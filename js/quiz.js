        // Global variables
        let currentStep = 1;
        const totalSteps = 6;

        // Set background based on URL parameter
        function setBackgroundFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            const bgParam = urlParams.get('bg');
            
            if (bgParam) {
                const backgroundOverlay = document.querySelector('.background-overlay');
                const bgNumber = bgParam.padStart(2, '0');
                
                const landscapeImage = `url('images/bg${bgNumber}.jpg')`;
                const portraitImage = `url('images/bg${bgNumber}-portrait.jpg')`;
                
                backgroundOverlay.style.setProperty('--bg-landscape', landscapeImage);
                backgroundOverlay.style.setProperty('--bg-portrait', portraitImage);
                backgroundOverlay.classList.add('has-image');
                
                const landscapeImg = new Image();
                const portraitImg = new Image();
                
                landscapeImg.src = `images/bg${bgNumber}.jpg`;
                portraitImg.src = `images/bg${bgNumber}-portrait.jpg`;
                
                landscapeImg.onerror = () => {
                    console.warn(`Background image bg${bgNumber}.jpg not found`);
                };
                portraitImg.onerror = () => {
                    console.warn(`Background image bg${bgNumber}-portrait.jpg not found`);
                };
                
                console.log(`Background set to: bg${bgNumber}.jpg`);
            }
        }

        // Initialize particles background
        function initParticles() {
            if (typeof particlesJS !== 'undefined') {
                particlesJS("particles-js", {
                    "particles": {
                        "number": {
                            "value": 80,
                            "density": {
                                "enable": true,
                                "value_area": 800
                            }
                        },
                        "color": {
                            "value": "#ffffff"
                        },
                        "shape": {
                            "type": "circle"
                        },
                        "opacity": {
                            "value": 0.5,
                            "random": false,
                            "anim": {
                                "enable": true,
                                "speed": 0.5,
                                "opacity_min": 0.1,
                                "sync": false
                            }
                        },
                        "size": {
                            "value": 3,
                            "random": true,
                            "anim": {
                                "enable": true,
                                "speed": 2,
                                "size_min": 0.1,
                                "sync": false
                            }
                        },
                        "line_linked": {
                            "enable": false
                        },
                        "move": {
                            "enable": true,
                            "speed": 1,
                            "direction": "none",
                            "random": true,
                            "straight": false,
                            "out_mode": "out",
                            "bounce": false
                        }
                    },
                    "interactivity": {
                        "detect_on": "canvas",
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "bubble"
                            },
                            "onclick": {
                                "enable": false
                            },
                            "resize": true
                        },
                        "modes": {
                            "bubble": {
                                "distance": 100,
                                "size": 6,
                                "duration": 2,
                                "opacity": 0.8,
                                "speed": 3
                            }
                        }
                    },
                    "retina_detect": true
                });
            }
        }

        // Play click sound effect (visual indicator)
        function playClickSound() {
            const soundEffect = document.getElementById('soundEffect');
            if (soundEffect) {
                soundEffect.classList.add('show');
                setTimeout(() => {
                    soundEffect.classList.remove('show');
                }, 500);
            }
        }

        // Update progress bar
        function updateProgress() {
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
                const progress = (currentStep / totalSteps) * 100;
                progressBar.style.width = progress + '%';
            }
        }

        // Navigate to next question
        function nextQuestion(nextStep, answer) {
            playClickSound();
            
            console.log(`Question ${currentStep} answered: ${answer}`);
            
            const currentQuestion = document.getElementById(`question${currentStep}`);
            if (!currentQuestion) return;
            
            currentQuestion.classList.add('fade-out');
            
            setTimeout(() => {
                currentQuestion.style.display = 'none';
                currentQuestion.classList.remove('fade-out');
                
                const nextQuestionEl = document.getElementById(`question${nextStep}`);
                if (nextQuestionEl) {
                    nextQuestionEl.style.display = 'block';
                    currentStep = nextStep;
                    updateProgress();
                }
            }, 400);
        }

        // Exit flow
        function exitFlow() {
            playClickSound();
            console.log('User exited the flow');
            alert('Thank you for your interest. This content is not suitable for your criteria.');
        }

        // Complete the quiz and redirect
        function completeQuiz() {
            playClickSound();
            console.log('Quiz completed - redirecting to game');
            
            const quizContent = document.getElementById('quizContent');
            const redirectMessage = document.getElementById('redirectMessage');
            
            if (quizContent) quizContent.classList.add('hidden');
            if (redirectMessage) redirectMessage.classList.add('show');
            
            setTimeout(() => {
                redirectToGame();
            }, 3000);
        }

        // Redirect logic - uses URL parameter or default tracking link
        function redirectToGame() {
            const urlParams = new URLSearchParams(window.location.search);
            const clickUrl = urlParams.get('url') || 'https://trk.play4free.net/click';
            window.location.href = clickUrl;
        }

        // Button click handler using event delegation
        function handleButtonClick(event) {
            const button = event.target.closest('.quiz-button');
            if (!button) return;

            const nextStep = button.dataset.next;
            const answer = button.dataset.answer;
            const shouldExit = button.dataset.exit;
            const shouldComplete = button.dataset.complete;

            if (shouldExit) {
                exitFlow();
            } else if (shouldComplete) {
                completeQuiz();
            } else if (nextStep && answer) {
                nextQuestion(parseInt(nextStep), answer);
            }
        }

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            setBackgroundFromUrl();
            initParticles();
            updateProgress();

            // Add single event listener for all buttons
            document.addEventListener('click', handleButtonClick);

            console.log('Quiz initialized successfully');
        });

        // Handle window resize for particles
        window.addEventListener('resize', function() {
            if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                window.pJSDom[0].pJS.fn.vendors.resize();
            }
        });
