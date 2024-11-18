const OR = "OR";
const AND = "AND";
const NOT = "NOT";
const NOR = "NOR";
const NAND = "NAND";
const XOR = "XOR";
const CHIP = "CHIP";
const SWITCH = "SWITCH";
const NODE = "NODE";

const SIM = "SIMULATION"; //simulate mode
const IC = "NEW_CHIP"; //integrated circuit mode

const NODE_RADIUS = 6;
const SWITCH_RADIUS = 15;

const CREATION = "CREATION";
const DELETION = "DELETION";

const GATELIST = [OR, AND, NOT, NOR, NAND, XOR];

const SIM_BTN = document.querySelector("#sim_btn"); //simulation button
const IC_BTN = document.querySelector("#ic_btn"); //new chip button
