exports.generateRandomNumber = () => {
  let randomNumber = Math.random()
    .toString(20)
    .substring(2, 2 + 10);

  // Ensure the generated number has the correct length
//   while (randomNumber.length < 10) {
//     randomNumber += Math.floor(Math.random() * 10).toString();
//   }

  return randomNumber;
};

