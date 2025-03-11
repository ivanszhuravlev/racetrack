// document.addEventListener("DOMContentLoaded", function() {
//     document.getElementById("myButton").addEventListener("click", function() {
//         alert("Button Clicked!");
//     });
// });

const Lib = {
    horse: {
        colors: [
            '#E50000',
            '#FF8C00',
            '#395c00',
            '#00CC00',
            '#007FFF',
            '#7c4e05',
            '#FF1493',
            '#00CED1',
            '#C71585',
            '#6F00FF',
        ],
        names: [
            'Stormchaser',
            'Luna',
            'Embermane',
            'Celestia',
            'Shadowfax',
            'Aurora',
            'Silverwind',
            'Mystic',
            'Thunderhoof',
            'Starfire',
        ],
    }
}

class Stadium {
    static get() {
        return document.getElementById("stadium");
    }
}

class TrackLabel {
    name;
    score;
    element;
    index;

    constructor(track, horse) {
        this.name = horse.name
        this.index = horse.index;
        this.element = track.element.querySelector(".track-label");
        this.score = 0;

        this.element.style.color = horse.color;

        this.updateLabel()
    }

    updateLabel () {
        this.element.textContent = `(${this.index + 1}) ${this.name}  |  Score: ${this.score}`
    }

    scoreUp() {
        this.score++;
    }

    show() {
        this.element.style.opacity = 1;
    }

    hide() {
        this.element.style.opacity = 0;
    }
}

class Track {
    index;
    color;
    element;

    static createColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

    constructor(index) {
        this.index = index;
        this.color = Lib.horse.colors[index];
    }

    createElement() {
        // const trackElement = document.createElement('div')
        const trackElement = document.getElementById("track-sprite").cloneNode(true);
        // let trackRoute = trackElement.querySelector(".track-route");
        // let label = trackElement.querySelector(".track-label");
        
        // trackElement.className = "track";
        trackElement.id = this.getElementId();
        trackElement.style.backgroundColor = this.backgroundColor

        this.element = trackElement;

        return trackElement;
    }

    getElementId() {
        return `track-${this.index}`;
    }

    get backgroundColor() {
        return `${this.color}10`
    }
}

class Horse {
    index;
    color;
    name;
    element;
    wins;

    constructor(index) {
        this.index = index;
        this.color = Lib.horse.colors[index];
        this.name = Lib.horse.names[index];
    }

    createElement() {
        const horseElement = document.createElement('div')
        
        horseElement.className = "horse";
        horseElement.id = this.getElementId();
        // horseElement.style.backgroundColor = this.color;
        horseElement.style.backgroundImage = `url('images/horses/h${this.index + 1}.png')`
        // horseElement.

        this.element = horseElement;

        return horseElement;
    }

    getElementId() {
        return `horse-${this.index}`;
    }
}

const generateTracks = (number) => {
    const tracks = [];

    const stadium = Stadium.get();

    Array(number).fill(0).forEach((_, index) => {
        const track = new Track(index);
        
        const trackElement = track.createElement()
        
        tracks.push(track);

        stadium.appendChild(trackElement);
    });

    return tracks;
}

const generateHorses = (tracks) => {
    const horses = [];

    tracks.forEach((track) => {
        const horse = new Horse(track.index);
        
        const horseElement = horse.createElement();
        
        horses.push(horse);

        let trackRoute = track.element.querySelector(".track-route");
        trackRoute.appendChild(horseElement);

    });

    return horses;
}

const generateScores = (tracks, horses) => {
    return tracks.map((track, index) => {
        return new TrackLabel(track, horses[index]);
    })
}

class Graphics {
    static drawFence = (track, fenceSprite) => {
        track.appendChild(fenceSprite)
    }

    static showFences() {
        const fences = document.querySelectorAll('.fence')

        fences.forEach((fence) => {
            fence.style.transform = 'translateX(0%)'
        })
    }

    static hideFences() {
        const fences = document.querySelectorAll('.fence')

        fences.forEach((fence) => {
            fence.style.transform = 'translateX(-100%)'
        })
    }

    static showButton() {
        const button = document.querySelector('.button')

        button.style.opacity = 1;
    }

    static hideButton() {
        const button = document.querySelector('.button')

        button.style.opacity = 0;
    }
}

class GameCore {
    static getRandomInRange = (min, max) => {
        return Math.random() * (max - min) + min;
    }

    // TODO: improve algorithm
    static createPoints = (steps) => {
        const arr = [];

        for(let index = 0; index < steps; index++) {
            console.log('step', index);
            
            if (index === 0) {
                arr.push(0);
            } else if (index === steps - 1) {
                arr.push(1);
            } else {
                const next = GameCore.getRandomInRange(arr[index - 1], 1)
                arr.push(next)
            }
            
        }

        return arr;
    }

    static showWinner = (horse) => {
        const winnerContainer = document.getElementById("winner-container");
        const winner = document.getElementById("winner-name");

        console.log("winner, winner", winner, winnerContainer);
        
        
        winner.appendChild(document.createTextNode(`(${horse.index + 1}) ${horse.name}`));
        winner.style.color = horse.color;

        winnerContainer.style.display = 'flex'
    }

    static resetWinner = () => {
        const winnerContainer = document.getElementById("winner-container");
        const winner = document.getElementById("winner-name");

        winner.replaceChildren(document.createTextNode(""));
        winner.style.color = '#ffffff';
        winnerContainer.style.display = 'none'
    }

    static declareWinner = (scoreLabel) => {
        scoreLabel.score += 1;
        scoreLabel.updateLabel()
    }
}

const startRound = (horses, winnerIndex, scores) => {
    Graphics.hideFences();
    Graphics.hideButton();

    scores.forEach((score) => {
       score.hide()
    });

}

const endRound = (horses, winnerIndex, scores) => {
    horses.forEach((horse) => {
        horse.element.style.marginLeft = 0;
    })

    winnerIndex = undefined;

    scores.forEach((score) => {
       score.show()
    })

    Graphics.showFences();
    Graphics.showButton();
}

const play = function (tracks, horses, scores) {
    let isPlaying = true;
    // const trackPoints = GameCore.createPoints(3);
    const totalDistance = window.innerWidth - horses[0].element.clientWidth;
    // let animationRunning = true;
    // let currentTrackPoint = 0;
    let winnerIndex = undefined;

    startRound(horses, winnerIndex, scores);

    function animate() {
        horses.forEach(horse => {
            const horseElement = horse.element;
            let currentPos = parseFloat(horseElement.style.marginLeft) || 0;
            let newPos = currentPos + Math.random() * Math.floor(GameCore.getRandomInRange(0, 15)); // Adjust speed

            if (newPos >= totalDistance) {
                newPos = totalDistance;
                isPlaying = false // If one reaches the end, stop all
                winnerIndex = horse.index;
                GameCore.declareWinner(scores[horse.index])
                GameCore.showWinner(horse)
                setTimeout(() => {
                    GameCore.resetWinner();
                    endRound(horses, winnerIndex, scores)
                }, 4000)
            }

            horseElement.style.marginLeft = newPos + "px";
        });

        if (isPlaying) {
            requestAnimationFrame(animate);
        }
    }

    animate();    
}

function main() {
    document.addEventListener("DOMContentLoaded", function() {
        const TRACKS = generateTracks(7);
        const HORSES = generateHorses(TRACKS);
        const SCORES = generateScores(TRACKS, HORSES);
        
        document.getElementById("play").addEventListener("click", () => play(TRACKS, HORSES, SCORES));
        document.addEventListener('keydown', function(event) {
            if (event.key === ' ' || event.code === 'Space') {
                play(TRACKS, HORSES, SCORES)
            }
          });
    });
}

main()