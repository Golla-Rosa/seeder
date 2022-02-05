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
  console.log(notes.intervals.map(interval => `${interval.notes[0].getName()} ${interval.gap.name} ${interval.notes[1]?.getName()} `))
  console.log(notes.chords.map(c => c.toString()))
  // intervalles
  // accords
  // gammes
}



generate();
