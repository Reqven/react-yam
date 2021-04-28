export default class Yam {

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
