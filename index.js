const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

process.stdin.setRawMode(true);

const exit = () => {
  console.log('Exiting TranslateZ CLI.');
  rl.close();
};

process.stdin.on('data', function (key) {
  if (key.toString() === '\u001B') {
    exit();
  }
});

const makeRequest = async (url, method, body) => {
  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    return await response.json();
  } catch (e) {
    const message = '\n\nAPI Error: \n\n' + e.message + '\n\n';
    console.log(message);
    exit();
  }
};

const handleAddNumbersToDB = async (values) => {
  const resp = await makeRequest(
    'http://localhost:4000/numbers/process',
    'POST',
    { numbers: values },
  );

  const successMessage =
    '\n\n**************************************************\n' +
    'SUCCESS\n' +
    '**************************************************\n\n' +
    'final values: \n\n' +
    resp.numbers.join(', ') +
    '\n\n**************************************************';

  console.log(successMessage);
  exit();
};

const handleFindDuplicates = async (values) => {
  return await makeRequest('http://localhost:4000/numbers/duplicates', 'POST', {
    numbers: values,
  });
};

const inputIsValid = (values) => {
  let is_valid = true;

  if (!values.length) return false;

  values.forEach((val) => {
    if (val.includes('-')) {
      const [start, end] = val.split('-');
      if (!+start || !+end) is_valid = false;
    } else {
      if (!+val) is_valid = false;
    }
  });

  return is_valid;
};

const handleResponseInput = async (resp) => {
  const { duplicates, unique } = resp;

  if (duplicates.length) {
    const message =
      '\n\n**************************************************\n' +
      'WARNING\n' +
      '**************************************************\n\n' +
      'following values are duplicates and will be skipped: \n\n' +
      duplicates.join(', ') +
      '\n\n**************************************************\n\n' +
      'here is the list of final values that will be pushed: \n\n' +
      `${unique.length ? unique.join(', ') : '(none)'}` +
      '\n\n' +
      'press "enter" key to continue or press "esc" to exit\n';

    console.log(message);

    rl.on('line', async () => {
      console.log('Processing the numbers....');
      await handleAddNumbersToDB([...duplicates, ...unique]);
    });

    return;
  }

  console.log('\nno duplicates, processing the numbers....');
  await handleAddNumbersToDB([...duplicates, ...unique]);
};

const getUserInput = async (message) => {
  rl.question(message, async (input) => {
    const values = input
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.trim() !== '');

    if (!inputIsValid(values)) {
      getUserInput('invalid input, please try again!: \n\n');
      return;
    }

    try {
      const data = await handleFindDuplicates(values);
      await handleResponseInput(data);
    } catch (e) {
      console.error('error making API request:', e);
      exit();
    }
  });
};

console.log('Welcome to TranslateZ CLI!');
getUserInput('Please type comma-separated values: \n\n');
