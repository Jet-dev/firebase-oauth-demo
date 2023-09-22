import './style.css';
import { initializeApp } from 'firebase/app';
import { AuthProvider, GoogleAuthProvider, OAuthCredential, getAuth, signInWithPopup, Auth } from 'firebase/auth';

let provider: AuthProvider;
let auth: Auth;

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
}

window.onload = () => {
    setInputValueWithConfigFromLocalstorage();
    addConfigListener();
};

const addConfigListener = () => {
    document.getElementById('add-config')?.addEventListener('click', (event) => {
        event.preventDefault();
        const apiKey = getInputValue('api-key');
        const authDomain = getInputValue('auth-domain');
        const projectId = getInputValue('project-id');
        const storageBucket = getInputValue('storage-bucket');
        const messagingSenderId = getInputValue('messaging-sender-id');
        const appId = getInputValue('app-id');

        const firebaseConfig = {
            apiKey,
            authDomain,
            projectId,
            storageBucket,
            messagingSenderId,
            appId
        };

        try {
            initializeApp(firebaseConfig);
        } catch ( e ) {
            alert('Configuration incorrect');
        }
        provider = new GoogleAuthProvider();
        auth = getAuth();
        addConfigToLocalstorage(firebaseConfig);
        setFormToReadOnly();
        removeAddConfigButton();
        addSignIn();
    });
}

const setFormToReadOnly = () => {
    const elements = document.querySelectorAll("#config-form input[type=text]")
    elements.forEach(element => {
        element.setAttribute('readonly', '');
    });
}

const removeAddConfigButton = () => {
    document.getElementById('add-config')?.remove();
}

const listenSignInButton = () => {
    document.getElementById('sign-with-google')?.addEventListener('click', () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const signInWithGoogleButton = document.getElementById('sign-with-google') as HTMLElement;
                signInWithGoogleButton.remove();

                const credential = GoogleAuthProvider.credentialFromResult(result) as OAuthCredential;
                const token = credential.idToken as string;

                const signInContainer = document.getElementById('sign-in-container') as HTMLElement;
                let preContainer: HTMLElement = document.createElement('div');
                preContainer.innerHTML = `
                    <h2 class="mt-10 mb-6 text-xl">Token</h2>
                    <pre class="bg-[#f4f4f4] border border-[#dddddd] border-l-4 border-l-[#FF772C] leading-10 p-1 pl-1.5 overflow-auto block w-full">${token}</pre>
                    <button id="clipboard-button" class="bg-[#FF772C] text-white py-2 px-4 rounded mt-4">Copier le token</button>
                `

                signInContainer.appendChild(preContainer);

                addTokenToClipboardWhenButtonClick(token);
            }).catch((error) => {
            console.log(error);
        });
    });
};

const addSignIn = () => {
    const signInContainer = document.getElementById('sign-in-container') as HTMLElement;
    signInContainer.innerHTML = `
            <button id="sign-with-google" class="w-64 h-10 bg-[#4285f4] rounded shadow flex">
              <div class="w-10 h-full bg-white flex align-middle justify-center">
                <img class="w-6" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
              </div>
              <div class="h-full text-white flex justify-center items-center flex-1">
                Sign in with google
              </div>
            </button>
    `;
    listenSignInButton();
};

const getInputValue = (id: string): string => {
    const input = document.getElementById(id) as HTMLInputElement;
    return input.value;
};

const addTokenToClipboardWhenButtonClick = (token: string) => {
    const button = document.getElementById('clipboard-button') as HTMLElement;
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(token);
    });

};

const addConfigToLocalstorage = (firebaseConfig: FirebaseConfig) => {
    localStorage.setItem('apiKey', firebaseConfig.apiKey);
    localStorage.setItem('authDomain', firebaseConfig.authDomain);
    localStorage.setItem('projectId', firebaseConfig.projectId);
    localStorage.setItem('storageBucket', firebaseConfig.storageBucket);
    localStorage.setItem('messagingSenderId', firebaseConfig.messagingSenderId);
    localStorage.setItem('appId', firebaseConfig.appId);
};

const setInputValueWithConfigFromLocalstorage = () => {
    const apiKey = localStorage.getItem('apiKey') as string;
    const authDomain = localStorage.getItem('authDomain') as string;
    const projectId = localStorage.getItem('projectId') as string;
    const storageBucket = localStorage.getItem('storageBucket') as string;
    const messagingSenderId = localStorage.getItem('messagingSenderId') as string;
    const appId = localStorage.getItem('appId') as string;

    if (apiKey) {
        setInputValue('api-key', apiKey);
        setInputValue('auth-domain', authDomain);
        setInputValue('project-id', projectId);
        setInputValue('storage-bucket', storageBucket);
        setInputValue('messaging-sender-id', messagingSenderId);
        setInputValue('app-id', appId);
    }
};

const setInputValue = (id: string, value: string): void => {
    const input = document.getElementById(id) as HTMLInputElement;
    input.value = value;
};

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="p-6 w-full h-screen flex flex-col justify-between">
      <div>
        <h1 class="text-2xl mb-6">Rentrez votre configuration Firebase</h1>
        <form id="config-form" class="w-full">
            <div class="mb-3">
                <label class="block text-gray-700 text-sm font-bold mb-1" for="api-key">apiKey</label>
                <input id="api-key" type="text" placeholder="apiKey" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline read-only:bg-gray-200">
            </div>
            <div class="mb-3">
                <label class="block text-gray-700 text-sm font-bold mb-1" for="auth-domain">authDomain</label>
                <input id="auth-domain" type="text" placeholder="authDomain" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline read-only:bg-gray-200">
            </div>
            <div class="mb-3">
                <label class="block text-gray-700 text-sm font-bold mb-1" for="project-id">projectId</label>
                <input id="project-id" type="text" placeholder="projectId" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline read-only:bg-gray-200">
            </div>
            <div class="mb-3">
                <label class="block text-gray-700 text-sm font-bold mb-1" for="storage-bucket">storageBucket</label>
                <input id="storage-bucket" type="text" placeholder="storageBucket" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline read-only:bg-gray-200">
            </div>
            <div class="mb-3">
                <label class="block text-gray-700 text-sm font-bold mb-1" for="messaging-sender-id">messagingSenderId</label>
                <input id="messaging-sender-id" type="text" placeholder="messagingSenderId" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline read-only:bg-gray-200">
            </div>
            <div class="mb-3">
                <label class="block text-gray-700 text-sm font-bold mb-1" for="app-id">appId</label>
                <input id="app-id" type="text" placeholder="appId" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline read-only:bg-gray-200">
            </div>
            <button id="add-config" type="submit" class="bg-[#FF772C] text-white py-2 px-4 rounded mt-2">Ajouter la configuration</button>
        </form>
        <div id="sign-in-container"></div>
      </div>
    <div class="bottom-0 w-full flex justify-center font-montserrat">Made with 🧡 by Jetdev</div>
  </div>
`;

