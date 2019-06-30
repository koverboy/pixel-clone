var example = document.getElementById("canvas");
var clearButton = document.getElementById("clear");
var saveButton = document.getElementById("save");
var animationButton = document.getElementById("animation");
var FPSButton = document.getElementById("FPS");
var ShapeButton = document.getElementById("shape");
var colorPull = document.getElementById("color");
let framepull = document.getElementById("framepull");
let OutputFPS = document.getElementById("eventPull__FPS");
let CanvasSize = document.getElementById("size");
let Shapeblock = document.getElementById("Shapeblock");
let RecordButton = document.getElementById("record");
let FrameInput = document.getElementById('FrameInput');
let EventPullContent = "";
let canvasSize = document.getElementById("canvasSize");
let shape = "square";
let counter = 0;
let Frames;
let Newframes = "";
var ctx;
let x, y = 0;

ctx = example.getContext('2d');
example.height = 500;
example.width = 500;
ctx.strokeStyle = '#191970';
ctx.strokeRect(0, 0, 500, 500);
let frames = [];
let frame = 0;
let PlayerSpeed = 100;
for (let i = 0; i < 500; i += 10)
    for (let j = 0; j < 500; j += 10) {
        ctx.strokeRect(i, j, 10, 10);
    }

window.addEventListener('beforeunload', Storage);
loadStorageData();
example.onmousedown = function (e) {


    let roundedPositionX = Math.floor(e.offsetX / parseInt(CanvasSize.value)) *
        parseInt(CanvasSize.value);
    let roundedPositionY = Math.floor(e.offsetY / parseInt(CanvasSize.value)) *
        parseInt(CanvasSize.value);
    switch (shape) {
        case "round" : {

            ctx.beginPath();
            ctx.arc(roundedPositionX + parseInt(CanvasSize.value) / 2,
                roundedPositionY + parseInt(CanvasSize.value) / 2,
                parseInt(CanvasSize.value) / 2, 0, 360);
            ctx.fill();
            ctx.stroke();
            createWeb();
            break;
        }

        case "square": {
            ctx.fillStyle = colorPull.value;
            ctx.fillRect(roundedPositionX, roundedPositionY, parseInt(CanvasSize.value), parseInt(CanvasSize.value));
            createWeb();
            break;
        }

        case "pen": {
            example.onmousemove = pen;
            function pen() {
                const newX = event.offsetX;
                const newY = event.offsetY;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(newX, newY);
                ctx.stroke();
                [x, y] = [newX, newY];
                createWeb();
            }
            example.onmouseup = () => {
                example.onmousemove = null;
            };
            break;
        }
        case "bucket":{
            ctx.fillStyle = colorPull.value;
            ctx.fillRect(0, 0, 500, 500);
            createWeb();
        }
    }

};


canvasSize.onmousemove = () => {
    let a = ctx.getImageData(0, 0, 500, 500);
    example.height = example.width = canvasSize.value;
    ctx.putImageData(a, 0, 0);
    createWeb();
};

clearButton.onmousedown = function clearArea() {

    ctx.clearRect(1, 1, 498, 498);
    for (let i = 0; i < 500; i += 10)
        for (let j = 0; j < 500; j += 10) {
            ctx.strokeRect(i, j, 10, 10);
        }


};
ShapeButton.onmouseup = function () {
    if (counter === 0) {
        Shapeblock.innerText = "";
        shape = "square";
        Shapeblock.style.borderRadius = 0 + "%";
        counter++;
    } else if (counter === 1) {
        shape = "round";
        Shapeblock.style.borderRadius = 50 + "%";
        counter++;
    } else if (counter === 2) {
        shape = "pen";
        Shapeblock.innerText = 'Pen';
        counter++;
    } else if (counter === 3) {
        shape="bucket";
        Shapeblock.innerText = 'Bucket';
        counter=0;
    }
};


saveButton.onmousedown = function save() {
    frames[frame] = ctx.getImageData(0, 0, 500, 500);
    frame++;
    var myImage = example.toDataURL("image/png");

    EventPullContent = `<img  src="${myImage}"  id="${frame}"  class="item" alt="">`;
    framepull.insertAdjacentHTML("beforeend", EventPullContent);
    if (frame >= 12) {
        framepull.removeChild(framepull.childNodes[0]);
    }
    Frames = (framepull.querySelectorAll('img'));
    addEvent();

    function addEvent() {
        Frames.forEach(
            function dragElement(elmnt) {
                if (document.getElementById(elmnt.id + "header")) {

                    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
                } else {

                    elmnt.onmousedown = dragMouseDown;
                    elmnt.onclick = deleteElmnt;
                }

                function dragMouseDown() {
                    document.onmouseup = closeDragElement;
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    elmnt.style.position = 'absolute';
                    let Ycoord = Math.round((e.pageY - elmnt.offsetHeight / 3) / 140) * 140;
                    let Xcoord = Math.round((e.pageX - elmnt.offsetWidth / 3) / 140) * 140;
                    elmnt.style.top = Math.abs(Ycoord) + "px";
                    elmnt.style.left = Math.abs(Xcoord) + "px";
                    FrameInput.onmouseout = () => {
                        Newframes += elmnt.id;
                        if (Newframes[Newframes.length - 2] === elmnt.id) {
                            Newframes = Newframes.substring(0, Newframes.length - 1);
                        }

                        elmnt.remove();

                    };
                }

                function deleteElmnt(e) {
                    if (e.shiftKey) {
                        console.log(frames);
                        frames.splice(parseInt(elmnt.id) - 1, 1);
                        elmnt.remove();
                    }
                    if (e.altKey) {
                        framepull.insertAdjacentHTML("beforeend", EventPullContent);
                    }

                }


                function closeDragElement() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                    FrameInput.onmouseover = null;
                }

            });

    }
};
animationButton.onmousedown = () => {
    animate();
};

FPSButton.onmousemove = function speed() {
    PlayerSpeed = FPSButton.value;
    OutputFPS.innerText = PlayerSpeed;
};

RecordButton.onmousedown = function Record() {
    var recorder = RecordRTC(ctx, {
        type: 'canvas',
        mimeType: 'video/mpeg'
    });
    recorder.startRecording();
    animate();
    setTimeout(function () {
        recorder.stopRecording(function (url) {
            window.open(url);

            recorder.save();
        });
    }, PlayerSpeed * 20);
};


function animate() {
    for (let j = 0; j < frame; j++) {
        setTimeout(function () {
            if (Newframes) {
                ctx.putImageData(frames[parseInt(Newframes[j]) - 1], 0, 0);
            } else {
                ctx.putImageData(frames[j], 0, 0);
            }
        }, j * PlayerSpeed)
    }
}


function Storage() {
    localStorage.setItem("NewFrames", framepull.innerHTML.toString());
    localStorage.setItem('EventPullContent', EventPullContent);
    localStorage.setItem('shape', shape);
    localStorage.setItem('color', colorPull.value.toString());


}


function loadStorageData() {
    EventPullContent = localStorage.getItem("EventPullContent");
    framepull.insertAdjacentHTML("beforeend", localStorage.getItem("NewFrames"));
    colorPull.value = localStorage.getItem("color");
}

function createWeb() {
    for (let i = 0; i < 500; i += 10)
        for (let j = 0; j < 500; j += 10) {
            ctx.strokeRect(i, j, 10, 10);
        }
}