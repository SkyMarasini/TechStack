        const gameBoard = document.getElementById('gameBoard');
        const scoreElement = document.getElementById('score');
        const techCountElement = document.getElementById('techCount');
        const stackItemsElement = document.getElementById('stackItems');
        const gameOverElement = document.getElementById('gameOver');
        const finalStackElement = document.getElementById('finalStack');
        
        const BOARD_SIZE = 20;
        const CELL_SIZE = 20;
        
        const technologies = [
            { name: '✨', color: '#f7df1e', fullName: 'JavaScript' },
            { name: '🐍', color: '#3776ab', fullName: 'Python' },
            { name: 'C', color: '#1572b6', fullName: 'C' },
            { name: 'C#', color: '#e34f26', fullName: 'C#' },
            { name: '⚛️', color: '#61dafb', fullName: 'React' },
            { name: '🖼️', color: '#4fc08d', fullName: 'Vue' },
            { name: '🌲', color: '#339933', fullName: 'Node' },
            { name: '🐘', color: '#777bb4', fullName: 'PHP' },
            { name: '☕', color: '#ed8b00', fullName: 'Java' },
            { name: '💣', color: '#00599c', fullName: 'C++' },
            { name: '🌀', color: '#00add8', fullName: 'GoLang' },
            { name: '🦀', color: '#808080', fullName: 'Rust' },
            { name: '📘', color: '#ffffffff', fullName: 'TypeScript' },
            { name: '🕊️', color: '#00ff55ff', fullName: 'Swift' },
            
        ];
        
        let collectedTechs = new Set();
        
        let snake = [{ x: 10, y: 10 }];
        let direction = { x: 0, y: -1 };
        let food = null;
        let currentTech = null;
        let score = 0;
        let techStack = [];
        let uniqueTechStack = [];
        let gameRunning = true;
        
        function getRandomPosition() {
            return {
                x: Math.floor(Math.random() * BOARD_SIZE),
                y: Math.floor(Math.random() * BOARD_SIZE)
            };
        }
        
        function getRandomTechnology() {
            const availableTechs = technologies.filter(tech => !collectedTechs.has(tech.name));
            if (availableTechs.length === 0) {
                // If all techs collected, allow repeats but make them worth more points
                return technologies[Math.floor(Math.random() * technologies.length)];
            }
            return availableTechs[Math.floor(Math.random() * availableTechs.length)];
        }
        
        function createFood() {
            let newPos;
            do {
                newPos = getRandomPosition();
            } while (snake.some(segment => segment.x === newPos.x && segment.y === newPos.y));
            
            food = newPos;
            currentTech = getRandomTechnology();
            
            const foodElement = document.createElement('div');
            foodElement.className = 'food';
            foodElement.style.left = food.x * CELL_SIZE + 'px';
            foodElement.style.top = food.y * CELL_SIZE + 'px';
            foodElement.style.background = currentTech.color;
            foodElement.textContent = currentTech.name;
            foodElement.id = 'food';
            
            gameBoard.appendChild(foodElement);
        }
        
        function updateDisplay() {
            // Clear board
            gameBoard.innerHTML = '';
            
            // Draw snake
            snake.forEach((segment, index) => {
                const segmentElement = document.createElement('div');
                segmentElement.className = 'snake-segment';
                if (index === 0) {
                    segmentElement.classList.add('snake-head');
                }
                segmentElement.style.left = segment.x * CELL_SIZE + 'px';
                segmentElement.style.top = segment.y * CELL_SIZE + 'px';
                
                // Show tech in snake body (only unique techs)
                if (index > 0 && uniqueTechStack[index - 1]) {
                    segmentElement.textContent = uniqueTechStack[index - 1].name;
                    segmentElement.style.background = uniqueTechStack[index - 1].color;
                    segmentElement.style.color = '#fff';
                }
                
                gameBoard.appendChild(segmentElement);
            });
            
            // Draw food
            if (food) {
                const foodElement = document.createElement('div');
                foodElement.className = 'food';
                foodElement.style.left = food.x * CELL_SIZE + 'px';
                foodElement.style.top = food.y * CELL_SIZE + 'px';
                foodElement.style.background = currentTech.color;
                foodElement.textContent = currentTech.name;
                gameBoard.appendChild(foodElement);
            }
            
            // Update UI
            scoreElement.textContent = score;
            techCountElement.textContent = uniqueTechStack.length;
            
            // Update tech stack display
            stackItemsElement.innerHTML = '';
            uniqueTechStack.forEach(tech => {
                const item = document.createElement('span');
                item.className = 'stack-item';
                item.textContent = tech.name;
                item.style.background = tech.color;
                item.style.color = '#fff';
                item.title = tech.fullName;
                stackItemsElement.appendChild(item);
            });
        }
        
        function moveSnake() {
            if (!gameRunning) return;
            
            const head = { ...snake[0] };
            head.x += direction.x;
            head.y += direction.y;
            
            // Check wall collision
            if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
                gameOver();
                return;
            }
            
            // Check self collision
            if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                gameOver();
                return;
            }
            
            snake.unshift(head);
            
            // Check food collision
            if (food && head.x === food.x && head.y === food.y) {
                const isNewTech = !collectedTechs.has(currentTech.name);
                collectedTechs.add(currentTech.name);
                
                if (isNewTech) {
                    score += 10;
                    uniqueTechStack.push(currentTech);
                } else {
                    score += 5; // Less points for duplicate techs
                }
               
                techStack.push(currentTech);
                createFood();
            } else {
                snake.pop();
            }
            
            updateDisplay();
        }
        
        function gameOver() {
            gameRunning = false;
            finalStackElement.innerHTML = `
                <strong>Final Stack ${uniqueTechStack.length}:</strong><br><br>
                ${uniqueTechStack.map(tech => `<span style="color: ${tech.color};">${tech.fullName}</span>`).join(', ') || ''}
                
            `;
            gameOverElement.style.display = 'block';
        }
        
        function restartGame() {
            snake = [{ x: 10, y: 10 }];
            direction = { x: 0, y: -1 };
            food = null;
            currentTech = null;
            score = 0;
            techStack = [];
            uniqueTechStack = [];
            collectedTechs = new Set();
            gameRunning = true;
            gameOverElement.style.display = 'none';
            createFood();
            updateDisplay();
        }
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!gameRunning) return;
            
            switch(e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    if (direction.y === 0) direction = { x: 0, y: -1 };
                    break;
                case 's':
                case 'arrowdown':
                    if (direction.y === 0) direction = { x: 0, y: 1 };
                    break;
                case 'a':
                case 'arrowleft':
                    if (direction.x === 0) direction = { x: -1, y: 0 };
                    break;
                case 'd':
                case 'arrowright':
                    if (direction.x === 0) direction = { x: 1, y: 0 };
                    break;
            }
        });
        
        // Initialize game
        createFood();
        updateDisplay();
        
        // Game loop
        setInterval(moveSnake, 100);