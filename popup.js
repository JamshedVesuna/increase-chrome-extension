document.addEventListener('DOMContentLoaded', function () {
  populateAccountDropdown();
  const createAccountButton = document.getElementById('createAccountButton');
  createAccountButton.addEventListener('click', createNewAccountNumber);
});

function populateAccountDropdown() {
  const apiUrl = 'https://sandbox.increase.com/accounts';
  const apiKey = '';

  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.data)
      const select = document.getElementById('accountSelect');
      data.data.forEach(account => {
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = account.name;
        select.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching accounts:', error);
    });
}

function createNewAccountNumber() {
  const apiKey = '';

  const apiUrl = 'https://sandbox.increase.com/account_numbers';

  const accountSelect = document.getElementById('accountSelect');
  const selectedAccountId = accountSelect.options[accountSelect.selectedIndex].value;

  const accountNumberName = document.getElementById('accountNumberNameInput').value.trim();
  const today = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const accountNumberNameToUse = accountNumberName || `AccountNumber ${today}`;


  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  const requestBody = {
    'account_id': selectedAccountId,
    'name': accountNumberNameToUse
  };

  console.log(headers)
  console.log(JSON.stringify(requestBody))
  fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);

      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = 'Account number: ' + data.account_number + '<br>Routing number: ' + data.routing_number; // Replace with the actual response property name

    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error creating account number. Please try again.');
    });
}

