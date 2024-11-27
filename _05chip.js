class Chip {
  constructor() {
    this.id = seed++;
    this.type = CHIP; //type of gate
    this.pos = createVector(125, 25);
    this.h = height - 50; //height of gate
    this.w = width - 150; //width of gate
    this.input = []; //input signals
    this.output = []; //output signals
    this.components = [];
    this.exists = true;
    this.removable = false;
    this.selected = false;
    this.static = true;
    this.fertile = false;
    this.new = true;
    this.visible = true;
    this.dragOffset = createVector(0, 0);
    this.name = "NEW CHIP";
    this.cx = this.pos.x + this.w / 2;
    this.cy = this.pos.y + this.h / 2;
    this.fabricating = true;
    this.inputArea = {
      x: this.pos.x,
      y: this.pos.y,
      w: IO_AREA_WIDTH,
      h: this.h,
    };
    this.outputArea = {
      x: this.pos.x + this.w - IO_AREA_WIDTH,
      y: this.pos.y,
      w: IO_AREA_WIDTH,
      h: this.h,
    };
    assignColor(this);
  }

  update() {
    this.delete();
    if (this.exists) {
      if (!this.fertile) {
        this.drag();
        this.select();
        this.updateStructure();
      }
      this.draw();
      for (let input of this.input) input.update();
      for (let gate of this.components) gate.update();
      for (let output of this.output) output.update();
    }
  }

  //draw gate in canvas
  draw() {
    if (this.visible) {
      stroke(255);
      strokeWeight(3);
      fill(this.color);
      rect(this.pos.x, this.pos.y, this.w, this.h); //drawing gate body
      if (this.fabricating) {
        rect(
          this.inputArea.x,
          this.inputArea.y,
          this.inputArea.w,
          this.inputArea.h
        );
        rect(
          this.outputArea.x,
          this.outputArea.y,
          this.outputArea.w,
          this.outputArea.h
        );
      }
      noStroke();
      fill(255);
      text(this.name, this.cx, this.cy);
    }
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
        if (this.pos.x > 100) {
          this.new = false;
        } else if (!this.new && this.pos.x < 100) {
          this.pos.x = 100;
        }
        if (this.pos.y < 0) {
          this.pos.y = 0;
        }
      }
    }
  }

  updateStructure() {
    if (dragObject == this || this.selected) {
      //update only if dragging / mass dragging
      // if (this.n1 > 1) {
      //   for (let i = 0; i < this.n1; i++) {
      //     this.input[i].pos.x = this.pos.x;
      //     this.input[i].pos.y = this.pos.y + this.margin + i * this.inputGap;
      //   }
      // } else {
      //   this.input[0].pos.x = this.pos.x;
      //   this.input[0].pos.y = this.pos.y + this.h / 2;
      // }
      // if (this.n2 > 1) {
      //   for (let i = 0; i < this.n2; i++) {
      //     this.output[i].pos.x = this.pos.x + this.w;
      //     this.output[i].pos.y = this.pos.y + this.margin + i * this.outputGap;
      //   }
      // } else {
      //   this.output[0].pos.x = this.pos.x + this.w;
      //   this.output[0].pos.y = this.pos.y + this.h / 2;
      // }
      // this.cx = this.pos.x + this.w / 2;
      // this.cy = this.pos.y + this.h / 2;
      if (!this.fabricating) restructureGate(this);
    }
    if (mode === IC && !this.static) {
      if (!chip.components.includes(this) && this != chip) {
        chip.components.push(this);
        deleteFromArrayIfExists(this, gates);
      }
    }
  }

  delete() {
    if (this.removable) {
      if (
        (keyIsDown(88) || keyIsDown(120)) &&
        !this.selected &&
        this.removable &&
        mouseIsPressed
      ) {
        if (pressedInside(this)) {
          this.exists = false;
          for (let input of this.input) {
            input.exists = false;
          }
          for (let output of this.output) {
            output.exists = false;
          }
        }
      }
      if (!this.exists) {
        deleteFromArrayIfExists(this, gates);
      }
    }
  }

  select() {
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
  getNewId() {
    this.id = seed++;
  }
}
