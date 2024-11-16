class Switch {
  constructor(pos) {
    this.type = SWITCH;
    this.id = seed++;
    this.r = 10;
    this.node = new PNode();
    this.center = pos;
    this.pos = createVector(pos.x - this.r * 2, pos.y);
    this.node.pos.set(pos.x + this.r, pos.y);
    this.node.static = true;
    this.node.dockable = false;
    this.node.superNode = true;
    this.node.removable = false;
    this.fertile = false;
    this.exists = true;
    this.removable = true;
    this.selected = false;
    this.dragOffset = createVector(0, 0);
    this.static = false;
  }
  draw() {
    stroke(255);
    strokeWeight(3);
    line(this.pos.x, this.pos.y, this.node.pos.x, this.node.pos.y);
    fill(75);
    circle(this.pos.x, this.pos.y, this.r * 2);
    this.node.update();
  }
  update() {
    this.delete();
    if (this.exists) {
      if (!this.freeze) {
        this.drag();
        this.select();
        this.switch();
        this.updateStructure();
      }
      this.genesis();
      this.draw();
    }
  }
  switch() {
    if (!this.selected) {
      if (mouseIsPressed) {
        let presedInside = p5.Vector.dist(this.pos, pressedPos) < this.r;
        if (presedInside) pressedObject = this;
      }
      if (mouseIsReleased) {
        let releasedInside = p5.Vector.dist(this.pos, releasedPos) < this.r;
        if (releasedInside) {
          if (switchBin === this) {
            this.node.signal = this.node.signal ? 0 : 1;
            switchBin = null;
          }
        }
      }
    }
  }

  drag() {
    if (!this.static) {
      if (!this.selected) {
        if (!dragObject) {
          if (mouseIsPressed) {
            if (
              pressedPos.x > this.pos.x + this.r &&
              pressedPos.x < this.node.pos.x - this.r &&
              pressedPos.y > this.pos.y - this.r &&
              pressedPos.y < this.pos.y + this.r
            ) {
              dragObject = this;
              this.dragOffset.set(p5.Vector.sub(pressedPos, this.pos));
            }
          }
        }
      }

      if (dragObject == this) {
        this.pos.set(mouseX - this.dragOffset.x, mouseY - this.dragOffset.y);
      }
    }
  }

  updateStructure() {
    if (dragObject === this || this.selected) {
      this.center.set(this.pos.x + this.r * 2, this.pos.y);
      this.node.pos.set(this.pos.x + this.r * 3, this.pos.y);
    }
  }

  delete() {
    if (keyIsDown(88) || keyIsDown(120)) {
      if (!this.selected) {
        if (this.removable) {
          if (mouseIsPressed) {
            if (
              pressedPos.x > this.pos.x + this.r &&
              pressedPos.x < this.node.pos.x - this.r &&
              pressedPos.y > this.pos.y - this.r &&
              pressedPos.y < this.pos.y + this.r
            ) {
              this.exists = false;
              this.node.exists = false;
            }
          }
        }
      }
    }
    if (!this.exists) {
      let index = gates.indexOf(this); // Find the index of this object in the array
      if (index > -1) {
        gates.splice(index, 1); // Remove this object from the array
      }
    }
  }

  select() {
    if (selection) {
      if (!this.selected) {
        if (!this.static) {
          if (
            this.pos.x > selectArea.p1.x &&
            this.pos.x < selectArea.p2.x &&
            this.pos.y > selectArea.p1.y &&
            this.pos.y < selectArea.p2.y
          ) {
            this.selected = true;
            selectees.push(this);
          }
        }
      }
    }

    if (!selection && !readyToMove) {
      this.selected = false;
    }
  }

  genesis() {
    if (this.fertile) {
      if (!dragObject) {
        if (mouseIsPressed) {
          if (
            pressedPos.x > this.pos.x + this.r &&
            pressedPos.x < this.node.pos.x - this.r &&
            pressedPos.y > this.pos.y - this.r &&
            pressedPos.y < this.pos.y + this.r
          ) {
            if (!myNewGate) {
              //genesis logic
              myNewGate = new Switch(createVector(pressedPos.x, pressedPos.y));
              myNewGate.dragOffset.set(p5.Vector.sub(pressedPos, this.pos));
              gates.push(myNewGate);
              dragObject = myNewGate;
            }
          }
        }
      }
    }
  }
}
