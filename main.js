
const bg = document.querySelector('.bg');
const heartSVG = document.querySelector('.heart');


// создаём сердца

const addHearts = () => {
    const colors = ['#FF4C4C', '#FF6B6B', '#FF7F7F', '#FF9999', '#FFC0CB']; 
    const numHearts = 16 + colors.length;
    let heartsScale = 0.1;
    let scaledIndex = 0;
    const hearts = [];

    for (let i = 0; i < numHearts; i++) {
    const newHeart = heartSVG.cloneNode(true);
    let scale = 1;
    if(i > colors.length){
        scale = 1 + scaledIndex * heartsScale;
        newHeart.style.transform = `scale(${scale})`;
        heartsScale += 0.02;
        scaledIndex += 1;
    }
    newHeart.style.zIndex = `${100-i}`;
    newHeart.querySelector('path').setAttribute('fill', colors[i % colors.length]); 
    bg.appendChild(newHeart);
    hearts.push({el: newHeart, scale, colorIndex: i % colors.length});
    }

    let scaleStep = colors.length;

    const animateHearts = () => {
        hearts.forEach(function (data, index) { 
            const nextHeart = hearts[index + scaleStep];
            if (!nextHeart) return;
            anime({
                targets: data.el,
                scale: hearts[index + scaleStep].scale,
                easing: 'linear',
                duration: 1500,
                loop: true,
            });
        })
    }

    animateHearts();
}

const addSparkles = () => {
    const container = document.querySelector('.sparkles');

    function createSparkle() {
        const s = document.createElement('span');
        s.className = 'sparkle';

        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';

        container.appendChild(s);

        requestAnimationFrame(() => {
            s.classList.add('animate');
        });

        setTimeout(() => s.remove(), 1200);
    }

    setInterval(() => {
        createSparkle();
    }, 50);

}

const addAnswers = () => {
    let prevX = 0;
    let prevY = 0;

    const changeAnswerPlace = (answer) => {
        const getNewCoord = (prev) => {
            let newCoord;
            do {
                newCoord = Math.random() * 200 - 100; 
            } while (Math.abs(newCoord - prev) < 50); 
            return newCoord;
        }

        const randomX = getNewCoord(prevX);
        const randomY = getNewCoord(prevY);

        prevX = randomX;
        prevY = randomY;

        console.log(randomX, randomY);
        answer.style.transform = `translate(${randomX}%, ${randomY}%)`;
    }

    const addAnswerControl = () => {
        const answers = document.querySelectorAll('.answer');
        answers.forEach(function(answer){
            answer.addEventListener('click', function(){
                console.log(answer)
                if(answer.id == 'no'){
                    changeAnswerPlace(answer);
                } else {
                    const certificate = document.querySelector('.certificate-overflow');
                    anime.set(certificate, {scale: 0});
                    certificate.style.visibility = 'visible';
                    certificate.style['pointer-events'] = 'all';
                    anime({
                        targets: certificate,
                        scale: 1,
                        ease: 'inExpo',
                        duration: 1000,
                    });

                    certificate.addEventListener('click', function () {
                        anime({
                            targets: certificate,
                            scale: 0,
                            ease: 'linear',
                            duration: 1000,
                            onComplete: () => {
                                certificate.style.visibility = 'hidden';
                                certificate.style['pointer-events'] = 'none';
                            }
                        });
                    })
                }
            })
        })
    }

    addAnswerControl();
}

const addGifs = () => {
    const numGifs = 7;
    const gifWidth = 100; // ширина GIF
    const gifHeight = 100; // высота GIF
    const container = document.querySelector('.container');

    const gifs = [];

    for (let i = 1; i <= numGifs; i++) {
        const img = document.createElement('img');
        img.src = `./gif${i}.gif`;
        img.classList.add('floating-gif');
        img.style.width = gifWidth + 'px';
        img.style.height = gifHeight + 'px';
        img.style.position = 'absolute';
        bg.appendChild(img);
        gifs.push(img);
    }

    function randomPosition(existingRects = []) {
        const bgRect = bg.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        let x, y, rect, overlap, collidesContainer;
        
        do {
            x = Math.random() * (bgRect.width - gifWidth);
            y = Math.random() * (bgRect.height - gifHeight);
            rect = {x, y, width: gifWidth, height: gifHeight};
            
            // проверка на пересечение с контейнером
            collidesContainer = !(
                rect.x + rect.width < containerRect.left ||
                rect.x > containerRect.right ||
                rect.y + rect.height < containerRect.top ||
                rect.y > containerRect.bottom
            );
            
            // проверка на пересечение с другими GIF
            overlap = existingRects.some(r => !(
                rect.x + rect.width < r.x ||
                rect.x > r.x + r.width ||
                rect.y + rect.height < r.y ||
                rect.y > r.y + r.height
            ));
        } while (collidesContainer || overlap);
        
        existingRects.push(rect);
        return rect;
    }


    const placedRects = [];
    gifs.forEach(img => {
        const {x, y} = randomPosition(placedRects);
        img.style.left = x + 'px';
        img.style.top = y + 'px';
    });
}

document
  .getElementById('printCertificate')
  .addEventListener('click', () => {
    window.print();
  });

addHearts();
addSparkles();
addAnswers();
addGifs();