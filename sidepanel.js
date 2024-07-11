let timeout=0;

    // Function to update UI based on auto-reload status
    const updateUI = async () => {
      const { autoReloadRunning } = await getStoredValues();
      const toggleButton = document.getElementById('toggleButton');
      const status = document.getElementById('status');
  
      if (autoReloadRunning) {
        toggleButton.textContent = 'Stop';
        toggleButton.classList.add('stop'); // Add 'stop' class for red background
        status.textContent = 'Status: Running';

  document.querySelector('.loader').classList.add('running');
      } else {
        toggleButton.textContent = 'Start';
        toggleButton.classList.remove('stop'); // Remove 'stop' class for green background
        status.textContent = 'Status: Not Running';
  document.querySelector('.loader').classList.remove('running');

      }
    }; // Function to retrieve stored values from local storage
    const getStoredValues = () => {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(['A17', 'nin', 'nss', 'tel', 'autoReloadRunning'], (data) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(data);
          }
        });
      });
    };
     // Function to start auto-reload process
    const startAutoReload = async () => {
      let { A17,nin, nss,tel } = await getStoredValues();
      A17 = document.getElementById('A17').value || A17;
      nss = document.getElementById('nss').value || nss;
      nin = document.getElementById('nin').value || nin;
      tel = document.getElementById('tel').value || tel;
  
      // Store the values in local storage (in case they've been updated)
      chrome.storage.local.set({ nin, nss });
  
      // Send message to background.js to start auto reload
      chrome.runtime.sendMessage({ action: "startAutoReload",force: true });
  
      // Update UI
      updateUI();
    };
  
    // Function to stop auto-reload process
    const stopAutoReload = () => {
      // Send message to background.js to stop auto reload
      chrome.runtime.sendMessage({ action: "stopAutoReload" });
  
      // Update UI
      updateUI();
    };
  
document.addEventListener('DOMContentLoaded', () => {
   
 
  
    // Add event listener to toggleButton
    document.getElementById('toggleButton').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: "getAutoReloadStatus" }, (response) => {
        const { isRunning } = response;
  
        if (isRunning) {
          stopAutoReload();
        } else {
          startAutoReload();
        }
      });
    });
  
    // Populate inputs and initialize UI based on current state
    getStoredValues().then(({ A17, nin, nss, tel }) => {
      document.getElementById('A17').value = A17 || '';
      document.getElementById('nss').value = nss || '';
      document.getElementById('nin').value = nin || '';
      document.getElementById('tel').value = tel || '';
      
  
      updateUI(); // Initialize UI based on auto-reload status
    }).catch((error) => {
      console.error('Error retrieving values from local storage:', error);
    });
  });
  document.addEventListener('DOMContentLoaded', (event) => {
     // Reset local storage when reset button is clicked
     document.getElementById('resetButton').addEventListener('click', function() {
      chrome.storage.local.clear();
      document.getElementById('A17').value =  '';
      document.getElementById('nss').value =  '';
      document.getElementById('nin').value = '';
      document.getElementById('tel').value = '';
      const origin = 'https://aadl3inscription2024.dz';

      chrome.browsingData.remove({
        origins: [origin]
      }, {
        "cache": true,
        "cookies": true,
        "fileSystems": true,
        "indexedDB": true,
        "localStorage": true,
        "serviceWorkers": true,
        "webSQL": true
      }, () => {
        alert('Data cleared for ' + origin);
      });
  });
    const A17 = document.getElementById('A17');
    const nin = document.getElementById('nin');
    const nss = document.getElementById('nss');
    const tel = document.getElementById('tel');

    // Listen to change event on the select element
    A17.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        console.log(`Selected value: ${selectedValue}`);
        chrome.storage.local.set({ A17: selectedValue });
    });

    // Listen to input events on the text inputs
    nin.addEventListener('input', (event) => {
        const ninValue = event.target.value;
        console.log(`NIN value: ${ninValue}`);
        chrome.storage.local.set({ nin: ninValue });
    });

    nss.addEventListener('input', (event) => {
        const nssValue = event.target.value;
        console.log(`NSS value: ${nssValue}`);
        chrome.storage.local.set({ nss: nssValue });
    });

    tel.addEventListener('input', (event) => {
        const telValue = event.target.value;
        console.log(`Tel value: ${telValue}`);
        chrome.storage.local.set({ tel: telValue });
    });
});

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'stopAutoReload') {
      chrome.storage.local.set({ autoReloadRunning: false });
      updateUI();
      sendResponse({ success: true });
    }
if(request.action === 'countdownrestart') {
  clearTimeout(timeout)
  document.querySelector('.countdown-container1').classList.add('reloading')
  document.querySelector('.loader').classList.add('reloading')

  resetCountdown();
  timeout=setTimeout(() => {
  document.querySelector('.countdown-container1').classList.remove('reloading')

  document.querySelector('.loader').classList.remove('reloading')
    
  }, 11000);
  sendResponse({ success: true });
}
    return true;
  });