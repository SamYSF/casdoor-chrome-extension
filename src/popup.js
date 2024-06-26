// Copyright 2022 The Casdoor Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* eslint-disable no-undef */

document.addEventListener("DOMContentLoaded", function() {
  const enableAutoLoginDom = document.getElementById("enableAutoLogin");

  chrome.storage.sync.get("disableAutoLogin", ({disableAutoLogin}) => {
    enableAutoLoginDom.checked = !disableAutoLogin;
  });

  enableAutoLoginDom.addEventListener("click", function() {
    chrome.storage.sync.set({disableAutoLogin: !enableAutoLoginDom.checked});
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const loginOrLogoutDom = document.getElementById("loginOrLogout");

  loginOrLogoutDom.innerText = accessToken ? "Logout" : "Login";

  Promise.all([getStorageData("accessToken"), getStorageData("userProfile")])
    .then(([accessToken, userProfile]) => {
      if (accessToken.accessToken && userProfile.userProfile) {
        displayUserProfile(userProfile.userProfile)
        setInputDisabledState(true, "endpoint", "applicationName");
      } else {
        clearUserProfile();
      }
    })
    .catch((error) => {
      console.error("init SDK failed:", error);
      reject(error);
    });

  loginOrLogoutDom.addEventListener("click", function() {
    chrome.storage.sync.get("accessToken", ({accessToken}) => {
      if (accessToken) {
        logout();
      } else {
        setInput()
        .then(login())
        .catch(error => {
          console.error('Error login:', error);
      });
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const applicationNameDom = document.getElementById("applicationName");
  chrome.storage.sync.get("applicationName", ({applicationName}) => {
    if (applicationName) {
      applicationNameDom.value = applicationName;
    }
  });

  const endpointDom = document.getElementById("endpoint");
  chrome.storage.sync.get("endpoint", ({endpoint}) => {
    if (endpoint) {
      endpointDom.value = endpoint;
    }
  });
});

function setInput() {
  return new Promise((resolve, reject) => {
    const endpointDom = document.getElementById("endpoint");
    const applicationNameDom = document.getElementById("applicationName");
    chrome.storage.sync.set({ endpoint: endpointDom.value, applicationName: applicationNameDom.value }, function() {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve();
      }
    });
  });
}