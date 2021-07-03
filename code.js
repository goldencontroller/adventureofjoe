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
    };
    var directionalcollision = function(sprite1, sprite2) {
        item1 = sprite1;
        item2 = sprite2;
        item1_top = item1.top + item1.height;
        item2_top = item2.top + item2.height;
        item1_right = item1.left + item1.width;
        item2_right = item2.left + item2.width;
    
        b_collision = item2_top - item1.top;
        t_collision = item1_top - item2.top;
        l_collision = item1_right - item2.left;
        r_collision = item2_right - item1.left;
    
        if (t_collision < b_collision && t_collision < l_collision && t_collision < r_collision )
        {                           
        return "top";
        }
        if (b_collision < t_collision && b_collision < l_collision && b_collision < r_collision)                        
        {            
        return "bottom";
        }
        if (l_collision < r_collision && l_collision < t_collision && l_collision < b_collision)
        {
        return "left";
        }
        if (r_collision < l_collision && r_collision < t_collision && r_collision < b_collision )
        {
        return "right";
        }
    };

    await Photopea.runScript(window.parent, `app.open('${await getdataurl("images/level1.svg")}', null, true);`);
    await new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve();
        }, 169);
    });

    var playerhitbox = {
        top: 800,
        left: 125,
        width: 100,
        height: 100
    };
    var platformhitboxes = [
        {
            top: 980,
            left: 0,
            width: 1920,
            height: 100
        }
    ];
    await Photopea.runScript(window.parent, `app.open('${await getdataurl("images/joe.svg")}', null, true);`);
    await new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve();
        }, 169);
    });
    await Photopea.runScript(window.parent, `app.activeDocument.activeLayer.translate(${playerhitbox.left}, ${playerhitbox.top})`);

    var frame = 0;
    var playervelocity = [0, 0];
    var tick = async function() {
        frame++;
        if (keysDown.ArrowLeft) playervelocity[0] -= 5;
        if (keysDown.ArrowRight) playervelocity[0] += 5;

        if (Math.abs(playervelocity[0]) < 1) playervelocity[0] = 0;
        else playervelocity[0] /= 2;

        var playerAirbourne = true;
        for (var platform of platformhitboxes) {
            if (rect_collision(playerhitbox, platform)) {
                var directional = directionalcollision(playerhitbox, platform);
                if (directional == "right") {
                    playervelocity[0] = 0.1;
                }
                else if (directional == "left") {
                    playervelocity[0] = -0.1;
                }
                else if (directional == "bottom") {
                    playervelocity[1] = -0.1;
                }
                else if (directional == "top") {
                    playervelocity[1] = 0.1;
                    playerAirbourne = false;
                }
            }
        }
        if (playerAirbourne) {
            playervelocity[1] -= 0.25;
        }
        else {
            playervelocity[1] += 0.5;
            if (keysDown.x) playervelocity[1] = 10;
        }

        await Photopea.runScript(window.parent, `app.activeDocument.activeLayer.translate(${playervelocity[0]}, ${-playervelocity[1]})`);
        playerhitbox.left += playervelocity[0];
        playerhitbox.top -= playervelocity[1];

        requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
}

Photopea.runScript(window.parent, "app.documents.add(1920, 1080, 72, 'The Adventure of Joe')").then(async function() {
    await Photopea.runScript(window.parent, "app.UI.fitTheArea()");


    await initGame();
});