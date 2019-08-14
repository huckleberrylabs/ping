/*
- Change Epsilon and Alpha over time
*/

function randomBoxMullerTransform(): number {
  var u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randomBoxMullerTransform(); // resample between 0 and 1
  return num;
}

type Q = number[][];
type QInitOptions = "min" | "max" | "normal_distrib";

export class QAgent<Actions, States> {
  private stateMap: Map<number, States> = new Map<number, States>();
  private stateReverseMap: Map<States, number> = new Map<States, number>();
  private actionMap: Map<number, Actions> = new Map<number, Actions>();
  private actionReverseMap: Map<Actions, number> = new Map<Actions, number>();
  private Q: Q;
  private alpha: number = 0.8;
  private gamma: number = 0.5;
  private epsilon: number = 1;
  private actions: number = 0;
  private episodes: number = 0;
  constructor(
    actionSet: Actions[],
    stateSet: States[],
    alpha: number,
    gamma: number,
    epsilon: number,
    actions: number,
    episodes: number,
    initQ: QInitOptions | Q
  ) {
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;
    this.episodes = episodes;
    this.actions = actions;
    if (typeof initQ !== "string") {
      this.Q = initQ;
    } else if (typeof initQ === "string") {
      this.Q = this.initQ(actionSet, stateSet, initQ);
    } else {
      throw new Error("Invalid initQ");
    }
    this.initStateMap(stateSet);
    this.initActionMap(actionSet);
  }
  private initQ(
    actionSet: Actions[],
    stateSet: States[],
    initQ: QInitOptions
  ): Q {
    let array = new Array(stateSet.length);
    array = array.map(() => new Array(actionSet.length));
    if (initQ === "min") {
      return array.map(state => state.map(() => 0));
    } else if (initQ === "max") {
      return array.map(state => state.map(() => 1));
    } else if (initQ === "normal_distrib") {
      return array.map(state => state.map(() => randomBoxMullerTransform()));
    } else {
      throw new Error("Invalid initQ");
    }
  }
  private initStateMap(stateSet: States[]) {
    stateSet.forEach((state, index) => {
      this.stateMap.set(index, state);
      this.stateReverseMap.set(state, index);
    });
  }
  private initActionMap(actionSet: Actions[]) {
    actionSet.forEach((action, index) => {
      this.actionMap.set(index, action);
      this.actionReverseMap.set(action, index);
    });
  }
  private selectBestAction(availableActions: number[]): Actions {
    let bestAction = {
      quality: -1,
      index: -1,
    };
    availableActions.forEach((quality, actionIndex) => {
      if (quality > bestAction.quality) {
        bestAction.index = actionIndex;
        bestAction.quality = quality;
      }
    });
    const action = this.actionMap.get(bestAction.index);
    if (action) {
      return action;
    } else {
      throw new Error("Unexpected State");
    }
  }
  private selectRandomAction(availableActions: number[]): Actions {
    var min = 0;
    var max = availableActions.length - 1;
    var randIndex = Math.floor(Math.random() * (max - min)) + min;
    const randomAction = this.actionMap.get(randIndex);
    if (randomAction) {
      return randomAction;
    } else {
      throw new Error("Unexpected State");
    }
  }
  act(state: States): Actions {
    const { Q, epsilon } = this;
    const stateIndex = this.stateReverseMap.get(state);
    if (stateIndex) {
      const availableActions = Q[stateIndex];
      if (Math.random() > epsilon) {
        return this.selectBestAction(availableActions);
      } else {
        return this.selectRandomAction(availableActions);
      }
    } else {
      throw new Error("Unexpected State");
    }
  }
  learn(
    action: Actions,
    state_old: States,
    state_new: States,
    reward: number
  ): Q {
    const { Q, alpha, gamma } = this;
    const action_index = this.actionReverseMap.get(action);
    const state_old_index = this.stateReverseMap.get(state_old);
    const state_new_index = this.stateReverseMap.get(state_new);
    if (action_index && state_old_index && state_new_index) {
      Q[state_old_index][action_index] =
        (1 - alpha) * Q[state_old_index][action_index] +
        alpha * (reward + gamma * Math.max(...Q[state_new_index]));
      this.actions++;
      return Q;
    } else {
      throw new Error("Unexpected State");
    }
  }
  incrementEpisode() {
    this.episodes++;
  }
}
