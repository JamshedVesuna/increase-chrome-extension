document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get('apiKey', function(data) {
    if (data.apiKey) {
      hideApiKeyPrompt();
    }
  });
  document.getElementById('saveApiKeyButton').addEventListener('click', function() {
    var apiKey = document.getElementById('apiKeyInput').value;
    chrome.storage.local.set({apiKey: apiKey}, function() {
      console.log('API key saved');
      hideApiKeyPrompt();
      populateAccountDropdown();
    });
  });

  populateAccountDropdown();
  const createAccountButton = document.getElementById('createAccountButton');
  createAccountButton.addEventListener('click', createNewAccountNumber);
});

function hideApiKeyPrompt() {
  document.getElementById('apiKeyInput').style.display = 'none';
  document.getElementById('saveApiKeyButton').style.display = 'none';
}


function populateAccountDropdown() {
  const apiUrl = 'https://sandbox.increase.com/accounts';

  chrome.storage.local.get('apiKey', function(data) {
    const apiKey = data.apiKey;
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
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

  })
}

function createNewAccountNumber() {
  const apiUrl = 'https://sandbox.increase.com/account_numbers';

  const accountSelect = document.getElementById('accountSelect');
  const selectedAccountId = accountSelect.options[accountSelect.selectedIndex].value;

  const accountNumberName = document.getElementById('accountNumberNameInput').value.trim();
  const today = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const accountNumberNameToUse = accountNumberName || `AccountNumber ${today}`;


  const requestBody = {
    'account_id': selectedAccountId,
    'name': accountNumberNameToUse
  };

  chrome.storage.local.get('apiKey', function(data) {
    const apiKey = data.apiKey;
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          'account_id': selectedAccountId,
          'name': accountNumberNameToUse
      }),
    })
      .then(response => response.json())
      .then(data => {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = 'Account number: ' + data.account_number + '<br>Routing number: ' + data.routing_number; // Replace with the actual response property name

      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error creating account number. Please try again.');
      });
  })

}

