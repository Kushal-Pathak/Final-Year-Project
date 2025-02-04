class Switch {
  constructor(pos) {
    this.type = SWITCH;
    this.id = seed++;
    this.switchRadius = SWITCH_RADIUS;
    this.pos = createVector(pos.x - (5 / 4) * this.switchRadius, pos.y);
    this.node = new PNode();
    this.node.pos.set(this.pos.x + this.switchRadius * 2.5, pos.y);
    this.node.static = true;
    this.node.dockable = false;
    this.node.removable = false;
    this.node.source = null;
    this.node.parent = this;
    this.fertile = false; //
    this.exists = true; //
    this.removable = true; //
    this.selected = false; //
    this.dragOffset = createVector(0, 0); //
    this.static = false; //
    this.new = true; //
    this.visible = true;
    this.frozen = false; // freeze every updates except draw()
    this.color = color(0, 0, 0);
  }

  update() {
    //no need to redraw child if already drawn by draw()
    //if parent is frozen then children must also be frozen
    this.delete();
    if (this.exists) {
      if (!this.fertile) {
        this.drag();
        this.select();
        this.updateStructure();
        this.switch();
      }
      this.node.update();
      this.genesis();
      this.draw();
    }
  }

  draw() {
    stroke(255);
    strokeWeight(3);
    line(this.pos.x, this.pos.y, this.node.pos.x, this.node.pos.y);
    fill(0, 0, 0);
    circle(this.pos.x, this.pos.y, this.switchRadius * 2);
    this.node.draw();
  }

  drag() {
    if (!this.static) {
      if (!dragObject && !this.selected && mouseIsPressed) {
        if (pressedInside(this)) {
          dragObject = this;
          this.dragOffset.set(p5.Vector.sub(pressedPos, this.pos));
        }
      }

      if (dragObject == this) {
        this.pos.set(mouseX - this.dragOffset.x, mouseY - this.dragOffset.y);

        //check left bound with gate menu
        if (this.pos.x - this.switchRadius > 100) {
          this.new = false;
          this.node.new = false;
        } else if (!this.new && this.pos.x - this.switchRadius <= 100) {
          this.pos.x = 100 + this.switchRadius;
        }
        //check upper bound
        if (this.pos.y - this.switchRadius <= 0) {
          this.pos.y = 0 + this.switchRadius;
        }
      }
    }
  }

  switch() {
    if (!this.selected) {
      if (mouseIsPressed) {
        if (pressedInside(this, true)) pressedObject = this;
      }
      if (mouseIsReleased) {
        if (releasedInside(this, true)) {
          if (switchBin === this) {
            this.node.signal = this.node.signal ? 0 : 1;
            switchBin = null;
          }
        }
      }
    }
  }

  updateStructure() {
    if (dragObject === this || this.selected) {
      this.node.pos.set(this.pos.x + this.switchRadius * 2.5, this.pos.y);
    }
  }

  delete() {
    if (this.removable) {
      if (
        (keyIsDown(88) || keyIsDown(120)) &&
        !this.selected &&
        mouseIsPressed
      ) {
        if (pressedInside(this)) {
          this.exists = false;
          this.node.exists = false;
        }
      }
      if (!this.exists) {
        deleteFromArrayIfExists(this, gates);
      }
      if (this.pos.x - this.switchRadius < 100 && this !== dragObject)
        this.exists = false;
    }
  }

  select() {
    //switch select logic
    if (selection && !this.selected && !this.static) {
      if (isInsideSelectArea(this)) {
        this.selected = true;
        selectees.push(this);
      }
    }

    if (!selection && !readyToMove) {
      this.selected = false;
    }
  }

  genesis() {
    //switch genesis logic
    if (this.fertile && !dragObject && mouseIsPressed) {
      if (pressedInside(this)) {
        if (!myNewGate) {
          //genesis logic
          myNewGate = new Componentt(
            SWITCH,
            createVector(pressedPos.x, pressedPos.y)
          );
          myNewGate.dragOffset.set(p5.Vector.sub(pressedPos, this.pos));
          gates.push(myNewGate);
          dragObject = myNewGate;
        }
      }
    }
  }
  getNewId() {
    this.id = seed++;
  }
}


