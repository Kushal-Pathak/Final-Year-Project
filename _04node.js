class PNode {
  constructor(pos = createVector(0, 0)) {
    this.type = NODE;
    this.id = seed++;
    this.pos = pos;
    this.source = null;
    this.signal = 0;
    this.color = this.signal ? color(255, 0, 0) : color(80, 0, 0);
    this.static = false;
    this.dockable = true;
    this.extendable = true;
    this.exists = true;
    this.superNode = false;
    this.removable = true;
    this.selected = false;
    this.freeze = false;
    this.dragOffset = createVector(0, 0);
    this.fertile = false;
    this.new = true; //
  }
  update(parentFreeze) {
    if (parentFreeze) this.freeze = true;
    this.delete();
    if (this.exists) {
      if (!this.freeze) {
        if (this.source) {
          if (this.source.exists) {
            this.signal = this.source.signal;
          } else {
            this.signal = 0;
          }
        }
        this.color = this.signal ? color(255, 0, 0) : color(80, 0, 0);
        this.drag();
        this.select();
        this.connect();
      }
    }
    this.genesis();
    this.draw();
  }
  draw() {
    fill(this.color);
    stroke(255);
    strokeWeight(3);
    circle(this.pos.x, this.pos.y, 2 * NODE_RADIUS);
    strokeWeight(4);
    stroke(this.color);
    noFill();
    if (source === this) {
      let x1 = this.pos.x;
      let y1 = this.pos.y;
      let x2 = mouseX;
      let y2 = mouseY;
      let cx1 = x2 - 0; //x2
      let cy1 = y1 - 0; //y1
      let cx2 = x1 + 0; //x1
      let cy2 = y2 + 0; //y2
      line(x1, y1, x2, y2);
      //bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);
      //curve(x1, y1, cx1, cy1, cx2, cy2, x2, y2);
    }
    if (this.source) {
      if (this.source.exists) {
        let x1 = this.pos.x;
        let y1 = this.pos.y;
        let x2 = this.source.pos.x;
        let y2 = this.source.pos.y;
        let cx1 = x2 - 0; //x2
        let cy1 = y1 - 0; //y1
        let cx2 = x1 + 0; //x1
        let cy2 = y2 + 0; //y2
        line(x1, y1, x2, y2);
        //bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);
        //curve(x1, y1, cx1, cy1, cx2, cy2, x2, y2);
      }
    }
  }
  connect() {
    //seek connection
    if (this.extendable) {
      if (mouseIsPressed) {
        if (!source && !dragObject) {
          let pressedInside =
            p5.Vector.dist(this.pos, pressedPos) < NODE_RADIUS;
          if (pressedInside) source = this;
        }
      }
    }

    //establish/dock connection
    if (this.dockable) {
      if (wireBin) {
        if (this !== wireBin) {
          let releasedInside =
            p5.Vector.dist(this.pos, releasedPos) < NODE_RADIUS;
          if (releasedInside) {
            this.source = wireBin;
            wireBin = null;
          }
        }
      }
    }

    //break connection
    if (keyIsDown(68) || keyIsDown(100)) {
      if (!this.selected) {
        if (mouseIsPressed) {
          if (this.source) {
            if (p5.Vector.dist(this.pos, pressedPos) < NODE_RADIUS) {
              this.source = null;
              this.signal = 0;
            }
          }
        }
      }
    }
  }

  drag() {
    if (!this.static) {
      if (!this.selected) {
        if (keyIsDown(CONTROL)) {
          if (!dragObject) {
            if (mouseIsPressed) {
              if (p5.Vector.dist(this.pos, pressedPos) < NODE_RADIUS) {
                dragObject = this;
                this.dragOffset = p5.Vector.sub(pressedPos, this.pos);
              }
            }
          }
        }

        if (dragObject == this) {
          this.pos.set(mouseX - this.dragOffset.x, mouseY - this.dragOffset.y);
          if (this.pos.x > 100) {
            this.new = false;
          } else if (!this.new && this.pos.x <= 100) {
            this.pos.x = 100 + NODE_RADIUS;
          }
          if (this.pos.y <= 0) {
            this.pos.y = 0 + NODE_RADIUS;
          }
        }
      }
    }
  }

  delete() {
    if (keyIsDown(88) || keyIsDown(120)) {
      if (!this.selected) {
        if (this.removable) {
          if (mouseIsPressed) {
            if (p5.Vector.dist(this.pos, pressedPos) < NODE_RADIUS) {
              this.exists = false;
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
          if (p5.Vector.dist(this.pos, pressedPos) < NODE_RADIUS) {
            if (!myNewGate) {
              //genesis logic
              myNewGate = new PNode(createVector(pressedPos.x, pressedPos.y));
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
