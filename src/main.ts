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
        addSignIn();
    });
}

const listenSignInButton = () => {
    document.getElementById('sign-with-google')?.addEventListener('click', () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result) as OAuthCredential;
                const token = credential.idToken as string;

                const signInContainer = document.getElementById('sign-in-container') as HTMLElement;
                const pre: HTMLElement = document.createElement('pre');
                pre.innerText = token;

                const clipboardButton: HTMLElement = document.createElement('button');
                clipboardButton.setAttribute('id', 'clipboard-button');
                clipboardButton.innerText = 'Copy Token';

                signInContainer.appendChild(pre);
                signInContainer.appendChild(clipboardButton);

                addTokenToClipboardWhenButtonClick(clipboardButton, token);
            }).catch((error) => {
            console.log(error);
        });
    });
};

const addSignIn = () => {
    const signInContainer = document.getElementById('sign-in-container') as HTMLElement;
    signInContainer.innerHTML = `
            <button id="sign-with-google">Sign in with google</button>
    `;
    listenSignInButton();
};

const getInputValue = (id: string): string => {
    const input = document.getElementById(id) as HTMLInputElement;
    return input.value;
};

const addTokenToClipboardWhenButtonClick = (button: HTMLElement, token: string) => {
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
  <div>
    <h1>Rentrez votre configuration Firebase</h1>
    <form class="w-full">
        <input id="api-key" type="text" placeholder="apiKey">
        <input id="auth-domain" type="text" placeholder="authDomain">
        <input id="project-id" type="text" placeholder="projectId">
        <input id="storage-bucket" type="text" placeholder="storageBucket">
        <input id="messaging-sender-id" type="text" placeholder="messagingSenderId">
        <input id="app-id" type="text" placeholder="appId">
        <button id="add-config" type="submit">Ajouter la configuration</button>
    </form>
    <div id="sign-in-container"></div>
  </div>
`;

