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
    'http://localhost:8080/numbers/process',
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
  return await makeRequest('http://localhost:8080/numbers/duplicates', 'POST', {
    numbers: values,
  });
};

const validateInput = (values) => {
  let res = { is_valid: true, message: '' };

  if (!values.length) return { is_valid: false, message: 'no values entered!' };

  values.forEach((val) => {
    if (val.includes('-')) {
      const [start, end] = val.split('-');
      const invalidValue = !+start || !+end;
      const invalidRange = +start > +end;

      if (invalidValue || invalidRange) {
        res.is_valid = false;
        res.message = `\ninvalid range: ${start + '-' + end}`;
      }
    } else {
      if (!+val) {
        res.is_valid = false;
        res.message = `\ninvalid input: ${val}`;
      }
    }
  });

  return res;
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

    const validityCheckResp = validateInput(values);
    if (!validityCheckResp.is_valid) {
      getUserInput(validityCheckResp.message + '\n\n');
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
