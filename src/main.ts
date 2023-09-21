import './style.css';
import { initializeApp } from 'firebase/app';
import { environment } from '../environment.ts';
import { GoogleAuthProvider, OAuthCredential, getAuth, signInWithPopup } from 'firebase/auth';

initializeApp(environment.firebaseConfig);
const provider = new GoogleAuthProvider();

const auth = getAuth();
window.onload = () => {
    document.getElementById('sign-with-google')?.addEventListener('click', () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result) as OAuthCredential;
                const tokenContainer = document.getElementById('token') as HTMLElement;
                const token = credential.idToken as string;
                tokenContainer.innerText = token;
            }).catch((error) => {
            console.log(error);
        });
    });

}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Hello World</h1>
    <button id="sign-with-google">Sign in with google</button>
    <div>You token is <pre id="token"></pre></div>
  </div>
`;

