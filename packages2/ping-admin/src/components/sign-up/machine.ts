import { Machine } from "xstate";

interface LightStateSchema {
  states: {
    green: {};
    yellow: {};
    red: {
      states: {
        walk: {};
        wait: {};
        stop: {};
      };
    };
  };
}

// The events that the machine handles
type SignUpEvents =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SUBMIT" }
  | { type: "PED_COUNTDOWN"; duration: number };

// The context (extended state) of the machine
interface LightContext {
  elapsed: number;
}

const colorPickerStates = {
  initial: "closed",
  states: {
    open: {
      on: { TOGGLE: "closed" }
    },
    closed: {
      on: { TOGGLE: "open" }
    }
  }
};

const signUpMachine = Machine({
  id: "sign-up",
  initial: "design",
  context: {
    phone: undefined,
    homePage: undefined,
    color: undefined
  },
  states: {
    design: {
      on: { NEXT: "activate" },
      ...colorPickerStates
    },
    activate: {
      on: { PREV: "design", SUBMIT: "loading" }
    },
    loading: {
      on: { ERROR: "error", SUCCESS: "success" }
    },
    error: {
      type: "final"
    },
    success: {
      type: "final"
    }
  }
});

console.log(signUpMachine.transition("design", "NEXT").value);
