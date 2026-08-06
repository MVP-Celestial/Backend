import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter your message: ', (input) => {
  console.log(`You entered: ${input}`);
  rl.close();
});
