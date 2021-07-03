window.addEventListener("blur", function(e) {
    document.querySelector("span").style.display = "block";
});

window.addEventListener("focus", function(e) {
    document.querySelector("span").style.display = "none";
});

var keysDown = {};
window.addEventListener("keydown", function(e) {
    keysDown[e.key] = true;
});
window.addEventListener("keyup", function(e) {
    keysDown[e.key] = false;
});

async function initGame() {
    var rect_collision = function(sprite1, sprite2) {
        return (
            parseFloat(sprite1.top) + parseFloat(sprite1.height) >= parseFloat(sprite2.top) &&
            parseFloat(sprite1.left) + parseFloat(sprite1.width) >= parseFloat(sprite2.left) &&
            parseFloat(sprite1.top) <= parseFloat(sprite2.top) + parseFloat(sprite2.height) &&
            parseFloat(sprite1.left) <= parseFloat(sprite2.left) + parseFloat(sprite2.width)
        );
    }

    var playerhitbox = {
        top: 0,
        left: 0
    };
    await Photopea.runScript(window.parent, "app.open('https://yikuansun.github.io/dumbspacething/img/player_ship.png', null, true);");
    await Photopea.runScript(window.parent, `app.activeDocument.activeLayer.translate(${playerhitbox.left}, ${playerhitbox.left})`);

    var frame = 0;
    var tick = async function() {
        frame++;
        if (keysDown.ArrowLeft) {
            await Photopea.runScript(window.parent, `app.activeDocument.activeLayer.translate(-5, 0)`);
            playerhitbox.left -= 5;
        }
        if (keysDown.ArrowRight) {
            await Photopea.runScript(window.parent, `app.activeDocument.activeLayer.translate(5, 0)`);
            playerhitbox.left += 5;
        }

        requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
}

Photopea.runScript(window.parent, "app.documents.add(1920, 1080, 72, 'cool game')").then(async function() {
    await Photopea.runScript(window.parent, "app.UI.fitTheArea()");


    await initGame();
});