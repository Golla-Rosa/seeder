import { NotesGenerator } from './seeder/noteGen';
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`

function generate() {
  // notes
  var notes = new NotesGenerator();  
 console.log(notes)
  // intervalles
  // accords
  // gammes
}



generate();
