const initialState = {
  id: undefined,
  saved: false,
  data: [],
  results: {}
};

export default class Yam {

  constructor() {
    Object.assign(this, initialState);
  }

  play(throws = 1) {
    this.reset();
    this.id = new Date().getTime();
    this.data = [...Array(throws)].map(() => Yam.dice(5));
    return this.calc();
  }

  calc() {
    this.results = Yam.process(this.data);
    return this;
  }

  save() {
    this.saved = true;
    return this;
  }

  reset() {
    Object.assign(this, initialState);
    return this;
  }

  static from(obj) {
    const yam = new Yam();
    const { id, saved, data } = obj;
    const b = { id, saved, data };

    Object.assign(b, yam);
    return yam.calc();
  }

  static dice(count = undefined) {
    let dice = () => Math.floor(Math.random() * 6) + 1;
    count = parseInt(count) || 0;

    if (count < 2) { return dice(); }
    return [...Array(count)].map(() => dice());
  }

  static process(data) {
    const toFirst = (number, idx, array) => {
      return [number, array.filter(a => a === number).length];
    }
    const toSecond = ([number], idx, array) => {
      return idx === array.findIndex(([a]) => a === number);
    }

    return Array.prototype.concat(...data
      .map(a => a
        .map(toFirst)
        .filter(toSecond)
        .map(([,count]) => count)
      )).reduce((prev, cur) => {
      prev[cur] = (prev[cur] || 0) + 1;
      return prev;
    }, {});
  }
}
