function selectMultiple() {
  if (mouseIsPressed) {
    if (!dragObject) {
      if (!source) {
        if (!pressedObject) {
          if (!selection) {
            if (!readyToMove) {
              if (pressedPos.x > 100) {
                selection = true;
              }
            }
          }
        }
      }
    }
  }
  if (selection) {
    let x1 = pressedPos.x;
    let y1 = pressedPos.y;
    let mx = mouseX;
    let my = mouseY;
    if (mouseX < 100) mx = 100;
    let w = mx - x1; //width of selectedArea (can be negative or positive)
    let h = my - y1; //height of selectedArea (can be negative or positive)
    selectArea.w = abs(w);
    selectArea.h = abs(h);
    if (w < 0 && h < 0) {
      selectArea.p1 = createVector(mx, my);
      selectArea.p2 = createVector(mx + abs(w), my + abs(h));
    } else if (w < 0) {
      selectArea.p1 = createVector(mx, y1);
      selectArea.p2 = createVector(mx + abs(w), y1 + abs(h));
    } else if (h < 0) {
      selectArea.p1 = createVector(x1, my);
      selectArea.p2 = createVector(x1 + abs(w), my + abs(h));
    } else {
      selectArea.p1 = createVector(x1, y1);
      selectArea.p2 = createVector(x1 + abs(w), y1 + abs(h));
    }
    stroke(255);
    strokeWeight(0.5);
    fill(128, 0, 255, 50);

    rect(selectArea.p1.x, selectArea.p1.y, selectArea.w, selectArea.h);
  }

  if (readyToMove) {
    stroke(255);
    strokeWeight(0.5);
    fill(128, 0, 255, 50);
    rect(selectArea.p1.x, selectArea.p1.y, selectArea.w, selectArea.h);

    if (mouseIsPressed) {
      if (!dragObject) {
        if (
          mouseX > selectArea.p1.x &&
          mouseX < selectArea.p2.x &&
          mouseY > selectArea.p1.y &&
          mouseY < selectArea.p2.y
        ) {
          //pressed inside select area
          areaDragOffset = p5.Vector.sub(pressedPos, selectArea.p1);
          dragObject = selectArea;
          for (let gate of selectees) {
            gate.dragOffset = p5.Vector.sub(gate.pos, selectArea.p1);
          }
        } else {
          //pressed outside select area
          selectees = [];
          readyToMove = false;
        }
      }
    }
  }

  if (dragObject === selectArea) {
    selectArea.p1.set(mouseX - areaDragOffset.x, mouseY - areaDragOffset.y);
    selectArea.p2 = p5.Vector.add(
      selectArea.p1,
      createVector(selectArea.w, selectArea.h)
    );
    for (let gate of selectees) {
      gate.pos = p5.Vector.add(selectArea.p1, gate.dragOffset);
    }
  }
}

function massDelete() {
  if (selectees.length) {
    if (keyIsDown(DELETE)) {
      for (let gate of selectees) {
        gate.exists = false;
        for (let i = 0; i < gate.n2; i++) {
          gate.output[i].exists = false;
        }
        if (gate.type === SWITCH) gate.node.exists = false;
      }
      selectees = [];
      readyToMove = false;
    }
  }
}
