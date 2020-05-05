function heartProcessing() {
    if (health == 1 && (thinkTime - Math.floor(new Date().getTime() / 1000) < -1)) {
        thinkTime = Math.floor(new Date().getTime() / 1000);
        heart1.visible = false;
        health--;
    }
    else if (health == 2 && (thinkTime - Math.floor(new Date().getTime() / 1000) < -1)) {
        thinkTime = Math.floor(new Date().getTime() / 1000);
        heart2.visible = false;
        health--;
    }
    else if (health == 3 && (thinkTime - Math.floor(new Date().getTime() / 1000) < -1)) {
        thinkTime = Math.floor(new Date().getTime() / 1000);
        heart3.visible = false;
        health--;
    }

    heartZoomFlag = 1;
    heartCounter = 0;
}