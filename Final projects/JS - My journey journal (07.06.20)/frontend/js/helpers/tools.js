export const sumAimsBudget = aims => {
    let sum = 0;
    let sumArr = aims.map(el => sum += el.aimbudget);

    return sumArr[sumArr.length - 1]
};

export const getDataToday = () => {
    let month = new Date().getMonth();

    return `${new Date().getFullYear()}-${++month < 10 ? '0' + month : month}-${new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()}`
};