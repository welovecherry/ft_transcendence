// // Three.js 초기화
// const scene = new THREE.Scene(); // 씬(Scene) 생성
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // 카메라 설정
// const renderer = new THREE.WebGLRenderer(); // 렌더러 생성
// renderer.setSize(window.innerWidth, window.innerHeight); // 렌더러 크기 설정
// document.getElementById('gameContainer').appendChild(renderer.domElement); // 렌더러를 DOM에 추가

// // 배경색 설정 (흰색)
// renderer.setClearColor(0xffffff, 1); // 배경을 흰색으로 설정

// // 카메라 위치 설정
// camera.position.z = 5; // 카메라를 Z축 뒤로 이동 (씬의 내용을 볼 수 있도록)

// // 짙은 파란색 직사각형(탁구대) 생성
// const tableGeometry = new THREE.PlaneGeometry(4, 3); // 폭 4, 높이 3의 직사각형
// const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x000080 }); // 짙은 파란색(Material 색상 설정)
// const table = new THREE.Mesh(tableGeometry, tableMaterial); // Geometry와 Material을 합쳐 Mesh 생성
// scene.add(table); // 씬에 직사각형 추가

// // 네트 생성 (흰색 점선)
// const netMaterial = new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.1, gapSize: 0.1 });
// const netGeometry = new THREE.BufferGeometry();
// const netVertices = new Float32Array([
//     0, 1.5, 0, // 시작점
//     0, -1.5, 0 // 끝점
// ]);
// netGeometry.setAttribute('position', new THREE.BufferAttribute(netVertices, 3));
// const net = new THREE.Line(netGeometry, netMaterial);
// net.computeLineDistances(); // 점선 효과를 위한 거리 계산
// scene.add(net); // 씬에 네트 추가

// // 패들 생성
// const paddleGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.2); // 폭 0.1, 높이 0.5, 깊이 0.2
// const leftPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // 빨간색 패들
// const rightPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // 파란색 패들

// // 패들 Mesh 생성
// const leftPaddle = new THREE.Mesh(paddleGeometry, leftPaddleMaterial);
// const rightPaddle = new THREE.Mesh(paddleGeometry, rightPaddleMaterial);

// // 패들 위치 설정
// leftPaddle.position.set(-2.05, 0, 0.1); // Move closer to the left edge of the table
// rightPaddle.position.set(2.05, 0, 0.1); // Move closer to the right edge of the table

// // 패들 씬에 추가
// scene.add(leftPaddle);
// scene.add(rightPaddle);

// // 조명 추가 (패들이 3D로 보이도록)
// const light = new THREE.PointLight(0xffffff, 1, 10);
// light.position.set(0, 5, 5); // 조명 위치
// scene.add(light);

// // 밝은 방향 조명 추가
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // 밝은 흰색 조명
// directionalLight.position.set(0, 5, 5); // 위쪽 및 약간 앞쪽에 배치
// scene.add(directionalLight);

// // 공 생성 (Orange 3D Ball)
// // Define the geometry (Sphere)
// const ballGeometry = new THREE.SphereGeometry(0.15, 32, 32); 
// // Define the material (Standard Material with orange color)
// const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 }); 
// // Create the ball mesh (geometry + material)
// const ball = new THREE.Mesh(ballGeometry, ballMaterial); 

// // 공의 위치 설정 (Positioning the ball in the middle of the table)
// ball.position.set(0, 0.1, 0); 
// // Add the ball to the scene
// scene.add(ball);

// // Paddle Movement Logic
// const paddleSpeed = 0.1; // Speed at which paddles move
// const tableHeight = 3; // Total height of the table

// // Flags for paddle movement
// let leftPaddleUp = false, leftPaddleDown = false;
// let rightPaddleUp = false, rightPaddleDown = false;

// // Event listeners for key press and release
// document.addEventListener("keydown", (event) => {
//     switch (event.code) {
//         case "KeyW": // 'W' for moving left paddle up
//             leftPaddleUp = true;
//             break;
//         case "KeyS": // 'S' for moving left paddle down
//             leftPaddleDown = true;
//             break;
//         case "ArrowUp": // Up Arrow for moving right paddle up
//             rightPaddleUp = true;
//             break;
//         case "ArrowDown": // Down Arrow for moving right paddle down
//             rightPaddleDown = true;
//             break;
//     }
// });

// document.addEventListener("keydown", (event) => {
//     // Prevent default scroll behavior only for the arrow keys
//     if (["ArrowUp", "ArrowDown"].includes(event.code)) {
//         event.preventDefault();
//     }

//     // Handle paddle movement
//     switch (event.code) {
//         case "KeyW": // 'W' for moving left paddle up
//             leftPaddleUp = true;
//             break;
//         case "KeyS": // 'S' for moving left paddle down
//             leftPaddleDown = true;
//             break;
//         case "ArrowUp": // Up Arrow for moving right paddle up
//             rightPaddleUp = true;
//             break;
//         case "ArrowDown": // Down Arrow for moving right paddle down
//             rightPaddleDown = true;
//             break;
//     }
// });

// document.addEventListener("keyup", (event) => {
//     // Handle paddle movement
//     switch (event.code) {
//         case "KeyW":
//             leftPaddleUp = false;
//             break;
//         case "KeyS":
//             leftPaddleDown = false;
//             break;
//         case "ArrowUp":
//             rightPaddleUp = false;
//             break;
//         case "ArrowDown":
//             rightPaddleDown = false;
//             break;
//     }
// });



// // Function to update paddle positions
// function updatePaddles() {
//     // Move left paddle
//     if (leftPaddleUp && leftPaddle.position.y + paddleGeometry.parameters.height / 2 < tableHeight / 2) {
//         leftPaddle.position.y += paddleSpeed;
//     }
//     if (leftPaddleDown && leftPaddle.position.y - paddleGeometry.parameters.height / 2 > -tableHeight / 2) {
//         leftPaddle.position.y -= paddleSpeed;
//     }

//     // Move right paddle
//     if (rightPaddleUp && rightPaddle.position.y + paddleGeometry.parameters.height / 2 < tableHeight / 2) {
//         rightPaddle.position.y += paddleSpeed;
//     }
//     if (rightPaddleDown && rightPaddle.position.y - paddleGeometry.parameters.height / 2 > -tableHeight / 2) {
//         rightPaddle.position.y -= paddleSpeed;
//     }
// }

// // added


// // 애니메이션 루프
// function animate() {
//     requestAnimationFrame(animate); // 반복 호출

//     updatePaddles(); // Update paddle positions based on input

//     renderer.render(scene, camera); // 씬과 카메라를 렌더링
// }
// animate(); // 애니메이션 시작


// Three.js 초기화
const scene = new THREE.Scene(); // 씬(Scene) 생성
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // 카메라 설정
const renderer = new THREE.WebGLRenderer(); // 렌더러 생성
renderer.setSize(window.innerWidth, window.innerHeight); // 렌더러 크기 설정
document.getElementById("gameContainer").appendChild(renderer.domElement); // 렌더러를 DOM에 추가

// 배경색 설정 (흰색)
renderer.setClearColor(0xffffff, 1); // 배경을 흰색으로 설정

// 카메라 위치 설정
camera.position.z = 5; // 카메라를 Z축 뒤로 이동 (씬의 내용을 볼 수 있도록)

// 짙은 파란색 직사각형(탁구대) 생성
const tableGeometry = new THREE.PlaneGeometry(4, 3); // 폭 4, 높이 3의 직사각형
const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x000080 }); // 짙은 파란색(Material 색상 설정)
const table = new THREE.Mesh(tableGeometry, tableMaterial); // Geometry와 Material을 합쳐 Mesh 생성
scene.add(table); // 씬에 직사각형 추가

// 네트 생성 (흰색 점선)
const netMaterial = new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.1, gapSize: 0.1 });
const netGeometry = new THREE.BufferGeometry();
const netVertices = new Float32Array([0, 1.5, 0, 0, -1.5, 0]); // 네트 시작점과 끝점
netGeometry.setAttribute("position", new THREE.BufferAttribute(netVertices, 3));
const net = new THREE.Line(netGeometry, netMaterial);
net.computeLineDistances(); // 점선 효과를 위한 거리 계산
scene.add(net); // 씬에 네트 추가

// 패들 생성
const paddleGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.2); // 폭 0.1, 높이 0.5, 깊이 0.2
const leftPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // 빨간색 패들
const rightPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // 파란색 패들
const leftPaddle = new THREE.Mesh(paddleGeometry, leftPaddleMaterial);
const rightPaddle = new THREE.Mesh(paddleGeometry, rightPaddleMaterial);
leftPaddle.position.set(-2.05, 0, 0.1); // 왼쪽 패들 위치
rightPaddle.position.set(2.05, 0, 0.1); // 오른쪽 패들 위치
scene.add(leftPaddle);
scene.add(rightPaddle);

// 조명 추가 (패들이 3D로 보이도록)
const light = new THREE.PointLight(0xffffff, 1, 10);
light.position.set(0, 5, 5); // 조명 위치
scene.add(light);

// 밝은 방향 조명 추가
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // 밝은 흰색 조명
directionalLight.position.set(0, 5, 5); // 위쪽 및 약간 앞쪽에 배치
scene.add(directionalLight);


// 공 생성 (Orange 3D Ball)
const ballGeometry = new THREE.SphereGeometry(0.15, 32, 32); // 구체 생성
const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 }); // 주황색
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0.1, 0); // 공 초기 위치
scene.add(ball);

// Ball movement variables
let ballSpeedX = 0; // Ball speed in X direction
let ballSpeedY = 0; // Ball speed in Y direction

// Paddle Movement Logic
const paddleSpeed = 0.1; // 패들 이동 속도
const tableHeight = 3; // 테이블 높이

// Paddle flags for movement
let leftPaddleUp = false,
    leftPaddleDown = false,
    rightPaddleUp = false,
    rightPaddleDown = false;

// Event listeners for paddle movement
document.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown"].includes(event.code)) event.preventDefault();

    switch (event.code) {
        case "KeyW":
            leftPaddleUp = true;
            break;
        case "KeyS":
            leftPaddleDown = true;
            break;
        case "ArrowUp":
            rightPaddleUp = true;
            break;
        case "ArrowDown":
            rightPaddleDown = true;
            break;
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.code) {
        case "KeyW":
            leftPaddleUp = false;
            break;
        case "KeyS":
            leftPaddleDown = false;
            break;
        case "ArrowUp":
            rightPaddleUp = false;
            break;
        case "ArrowDown":
            rightPaddleDown = false;
            break;
    }
});

// Function to update paddle positions
function updatePaddles() {
    if (leftPaddleUp && leftPaddle.position.y + paddleGeometry.parameters.height / 2 < tableHeight / 2)
        leftPaddle.position.y += paddleSpeed;
    if (leftPaddleDown && leftPaddle.position.y - paddleGeometry.parameters.height / 2 > -tableHeight / 2)
        leftPaddle.position.y -= paddleSpeed;

    if (rightPaddleUp && rightPaddle.position.y + paddleGeometry.parameters.height / 2 < tableHeight / 2)
        rightPaddle.position.y += paddleSpeed;
    if (rightPaddleDown && rightPaddle.position.y - paddleGeometry.parameters.height / 2 > -tableHeight / 2)
        rightPaddle.position.y -= paddleSpeed;
}

// Function to move the ball
function moveBall() {
    ball.position.x += ballSpeedX;
    ball.position.y += ballSpeedY;

    // Reverse direction if ball hits top or bottom edges
    if (ball.position.y > 1.5 || ball.position.y < -1.5) ballSpeedY *= -1;

    // End game if ball hits left or right wall
    if (ball.position.x > 2 || ball.position.x < -2) endGame();
}


// Function to end the game
function endGame() {
    ballSpeedX = 0; // Stop ball movement
    ballSpeedY = 0;
    ball.position.set(0, 0.1, 0); // Reset ball to the center of the table
    startGameButton.textContent = "Game Over! Restart"; // Update button text
    startGameButton.disabled = false; // Enable the button for restart
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    moveBall(); // Move the ball
    updatePaddles(); // Update paddle positions
    renderer.render(scene, camera);
}

// Start game button
const startGameButton = document.getElementById("startGameButton");
startGameButton.addEventListener("click", () => {
    ballSpeedX = 0.05 * (Math.random() > 0.5 ? 1 : -1); // Randomize X direction
    ballSpeedY = 0.03 * (Math.random() > 0.5 ? 1 : -1); // Randomize Y direction
    startGameButton.textContent = "Game Running...";
    startGameButton.disabled = true;
});

animate(); // Start animation loop