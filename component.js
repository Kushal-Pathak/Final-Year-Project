class Componentt {
  constructor(type = OR, pos = createVector(500, 200), n1 = 2, n2 = 1) {
    this.id = seed++; //gate's id (used to deserialize while loading saved circuit)
    this.type = type; //type of gate
    this.pos = pos; //position of gate in canvas
    this.exists = true; //boolean to decide if gate is to be deleted or not
    this.removable = true; //boolean to decide if gate is removable or not
    this.selected = false; //boolean to decide if gate is inside selected area or not
    this.static = false; //boolean to decide if gate is movable or not
    this.dragOffset = createVector(0, 0); //to store drag offset of gate with respect to pressed position of mouse
    this.frozen = false; //boolean to decide whether to freeze all updates except draw() function
    this.fertile = false; //boolean to decide if gate genesis gate / menu bar gate
    this.color = color(0, 0, 0); //gate's color
    this.new = true; //boolean to decide if gate is newly created or not

    if (this.type === NODE) {
      //node initiation
      this.color = color(80, 0, 0);
      this.extendable = true; //boolean to decide if node can be extented with wire
      this.dockable = true; //boolean to decide if node can be docked with wire
      this.source = null; //the source for this node
      this.signal = 0; //signal of this node
    } else if (this.type === SWITCH) {
      //switch initiation
      
      this.switchRadius = 15; //radius of switch button
      this.pos = createVector(pos.x - (5 / 4) * this.switchRadius, pos.y); //position of switch button
      this.node = new Componentt(NODE); //node of switch
      this.node.pos = createVector(
        this.pos.x + this.switchRadius * 2.5,
        this.pos.y
      ); //node's position
      this.node.static = true;
      this.node.dockable = false;
      this.node.superNode = true;
      this.node.removable = false;
      this.node.source = null;
    } else if (this.type === CHIP) {
      //chip initiation
    } else {
      //logic gate initiation
      n1 = 2;
      n2 = 1;
      if (this.type === OR) {
        this.color = color(255, 0, 0, 153);
      }

      if (this.type === AND) {
        this.color = color(0, 255, 0, 153);
      }

      if (this.type === NOR) {
        this.color = color(128, 0, 128, 153);
      }

      if (this.type === NAND) {
        this.color = color(255, 165, 0, 153);
      }

      if (this.type === XOR) {
        this.color = color(75, 0, 130, 153);
      }

      if (this.type === NOT) {
        this.color = color(0, 0, 255, 153);
        n1 = 1;
      }
      this.n1 = n1; //number of input ports
      this.n2 = n2; //number of output ports
      this.source = []; //input sources (source nodes)
      this.input = []; //input signals
      this.output = []; //output signals
      this.w = 75; //width of gate

      //generate input nodes
      for (let i = 0; i < this.n1; i++) {
        let node = new Componentt(NODE);
        node.static = true;
        node.extendable = false;
        node.removable = false;
        this.input.push(node);
      }

      //generate output nodes
      for (let i = 0; i < this.n2; i++) {
        let node = new Componentt(NODE);
        node.static = true;
        node.dockable = false;
        node.removable = false;
        this.output.push(node);
      }

      //dynamically calculating gate's height
      //gap1 is length between a extreme port and wall of gate
      //gap2 is field of span of a single port
      this.margin = NODE_RADIUS;
      this.gap = 3 * NODE_RADIUS;
      if (n1 > n2) {
        this.h = 2 * this.margin + this.n1 * this.gap;
      } else {
        this.h = 2 * this.margin + this.n2 * this.gap;
      }
      this.inputGap = this.h / (this.n1 + 1);
      this.outputGap = this.h / (this.n2 + 1);

      //port spacing
      for (let i = 0; i < this.n1; i++) {
        let y = this.pos.y + this.inputGap * (i + 1);
        this.input[i].pos.set(this.pos.x, y);
      }
      for (let i = 0; i < this.n2; i++) {
        let y = this.pos.y + this.outputGap * (i + 1);
        this.output[i].pos.set(this.pos.x + this.w, y);
      }

      //center of gate (to display text)
      this.cx = this.pos.x + this.w / 2;
      this.cy = this.pos.y + this.h / 2;
    }
  }

  //1
  update(drawn = false, frozenParent) {
    //no need to redraw children if already to be drawn by draw() method
    //if parent is frozen then children must also be frozen
    if (frozenParent) this.frozen = true;
    this.drag();
    this.updateStructure();
    this.connect();
    this.compute();
    if (this.node) this.node.update(); //for switch
    if (this.input) {
      //for gate
      for (let input of this.input) {
        input.update(true, this.frozen);
      }
    }
    if (this.output) {
      //for gate
      for (let output of this.output) {
        output.update(true, this.frozen);
      }
    }
    if (!drawn) this.draw();
  }

  //2
  draw() {
    if (this.type === NODE) {
      //drawing node
      stroke(255);
      strokeWeight(3);
      fill(this.color);
      circle(this.pos.x, this.pos.y, 2 * NODE_RADIUS);
      stroke(this.color);
      strokeWeight(4);
      noFill();
      if (source === this) {
        let x1 = this.pos.x;
        let y1 = this.pos.y;
        let x2 = mouseX;
        let y2 = mouseY;
        line(x1, y1, x2, y2);
      }
      if (this.source && this.source.exists) {
        let x1 = this.pos.x;
        let y1 = this.pos.y;
        let x2 = this.source.pos.x;
        let y2 = this.source.pos.y;
        line(x1, y1, x2, y2);
      }
    } else if (this.type === SWITCH) {
      //drawing switch
      stroke(255);
      strokeWeight(3);
      line(this.pos.x, this.pos.y, this.node.pos.x, this.node.pos.y);
      fill(75);
      circle(this.pos.x, this.pos.y, this.switchRadius * 2);
      this.node.draw();
    } else if (this.type === CHIP) {
      //drawing chip
    } else {
      //drawing gate
      stroke(255);
      strokeWeight(3);
      fill(this.color);
      rect(this.pos.x, this.pos.y, this.w, this.h); //drawing gate body
      noStroke();
      fill(255);
      text(this.type, this.cx, this.cy);
      for (let input of this.input) {
        input.draw();
      }
      for (let output of this.output) {
        output.draw();
      }
    }
  }

  compute() {
    if (this.type === NODE) {
      if (this.source) {
        if (this.source.exists) {
          this.signal = this.source.signal;
        } else {
          this.signal = 0;
        }
      }
      this.color = this.signal ? color(255, 0, 0) : color(80, 0, 0);
      return;
    }
    if (this.type === SWITCH) {
      //compute switch
      if (!this.selected) {
        if (mouseIsPressed) {
          let presedInside = p5.Vector.dist(this.pos, pressedPos) < this.switchRadius;
          if (presedInside) pressedObject = this;
        }
        if (mouseIsReleased) {
          let releasedInside = p5.Vector.dist(this.pos, releasedPos) < this.switchRadius;
          if (releasedInside) {
            if (switchBin === this) {
              this.node.signal = this.node.signal ? 0 : 1;
              switchBin = null;
            }
          }
        }
      }
      return;
    }
    if (this.type === CHIP) {
      //compute chip
      return;
    }
    computeGate(this);
  }

  //3
  drag() {
    if (this.type === NODE) {
      if (!this.static) {
        if (
          keyIsDown(CONTROL) &&
          !dragObject &&
          !this.selected &&
          mouseIsPressed
        ) {
          if (p5.Vector.dist(this.pos, pressedPos) < NODE_RADIUS) {
            dragObject = this;
            this.dragOffset = p5.Vector.sub(pressedPos, this.pos);
          }
        }

        if (dragObject === this) {
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
    } else if (this.type === SWITCH) {
      if (!this.static) {
        if (!dragObject && !this.selected && mouseIsPressed) {
          let x1 = this.pos.x + this.switchRadius;
          let x2 = this.node.pos.x - NODE_RADIUS;
          let y1 = this.pos.y - this.switchRadius;
          let y2 = this.pos.y + this.switchRadius;
          if (
            pressedPos.x > x1 &&
            pressedPos.x < x2 &&
            pressedPos.y > y1 &&
            pressedPos.y < y2
          ) {
            dragObject = this;
            this.dragOffset.set(p5.Vector.sub(pressedPos, this.pos));
          }
        }

        if (dragObject == this) {
          this.pos.set(mouseX - this.dragOffset.x, mouseY - this.dragOffset.y);
          if (this.pos.x - this.switchRadius > 100) {
            this.new = false;
          } else if (!this.new && this.pos.x - this.switchRadius <= 100) {
            this.pos.x = 100 + this.switchRadius;
          }
          if (this.pos.y - this.switchRadius <= 0) {
            this.pos.y = 0 + this.switchRadius;
          }
        }
      }
    } else {
      if (!this.static) {
        if (!dragObject && !this.selected && mouseIsPressed) {
          if (
            pressedPos.x > this.pos.x + 5 &&
            pressedPos.x < this.pos.x + this.w - 5 &&
            pressedPos.y > this.pos.y &&
            pressedPos.y < this.pos.y + this.h
          ) {
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
  }

  updateStructure() {
    if (this.type === NODE) return;

    if (this.type === SWITCH) {
      if (dragObject === this || this.selected) {
        this.node.pos.set(this.pos.x + this.switchRadius * 2.5, this.pos.y);
        return;
      }
    }

    if (this.type === CHIP) {
      //update chip structure here
      return;
    }

    if (dragObject === this || this.selected) {
      //for optimization only update the structure of gate if gate is being dragged
      let x = this.pos.x;
      for (let i = 0; i < this.input.length; i++) {
        let y = this.pos.y + this.inputGap * (i + 1);
        this.input[i].pos.set(x, y);
      }
      x = this.pos.x + this.w;
      for (let i = 0; i < this.output.length; i++) {
        let y = this.pos.y + this.outputGap * (i + 1);
        this.output[i].pos.set(x, y);
      }
      this.cx = this.pos.x + this.w / 2;
      this.cy = this.pos.y + this.h / 2;
    }
  }

  connect() {
    if (this.type === NODE) {
      //seek connection
      if (this.extendable && mouseIsPressed && !source && !dragObject) {
        let pressedInside = p5.Vector.dist(this.pos, pressedPos) < NODE_RADIUS;
        if (pressedInside) source = this;
      }

      //establish/dock connection
      if (this.dockable && wireBin && this !== wireBin) {
        let releasedInside =
          p5.Vector.dist(this.pos, releasedPos) < NODE_RADIUS;
        if (releasedInside) {
          this.source = wireBin;
          wireBin = null;
        }
      }

      //break connection
      if (
        (keyIsDown(100) || keyIsDown(68)) &&
        !this.selected &&
        mouseIsPressed &&
        this.source
      ) {
        let pressedInside = p5.Vector.dist(this.pos, pressedPos) < NODE_RADIUS;
        if (pressedInside) {
          this.source = null;
          this.signal = 0;
        }
      }
    }
  }
}
