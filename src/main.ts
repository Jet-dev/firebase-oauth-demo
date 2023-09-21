import './style.css'
import { initializeApp } from "firebase/app";
import { environment } from '../environment.ts';

initializeApp(environment.firebaseConfig);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Hello World</h1>
  </div>
`
