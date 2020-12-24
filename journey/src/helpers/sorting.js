export const sortNewestFirst = (array, sortObject) => {
  array.sort((a, b) => {
    a = new Date(a[sortObject]);
    b = new Date(b[sortObject]);
    // return a > b ? -1 : a < b ? 1 : 0; // Newest first
    return b - a;
  });
  return array;
};

// export const biggestFirst = (array, sortObject) => {
//   array.sort((a, b) => {
//     a = a[sortObject];
//     b = b[sortObject];
//     return b - a;
//   });
//   return array;
// };

// // Closest to the number, below or above
// export const sortClosestFirst = (array, sortObject) => {
//   array.sort((a, b) => {
//     a = Math.abs(a[sortObject]);
//     b = Math.abs(b[sortObject]);
//     return a - b;
//   });
//   return array;
// };
