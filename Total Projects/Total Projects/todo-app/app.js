const STORAGE_KEY = 'todos-v1';

const $ = sel => document.querySelector(sel);
const $all = sel => Array.from(document.querySelectorAll(sel));

let todos = [];
let filter = 'all';

// Features: add tasks, delete tasks, mark complete, save tasks in browser storage
// Concepts used: DOM manipulation, event listeners, localStorage, vanilla JavaScript

// Elements
const form = $('#todo-form');
const input = $('#todo-input');
const dueInput = $('#todo-due');
const list = $('#todo-list');
const countEl = $('#count');
const filters = $all('.filter');
const clearBtn = $('#clear-completed');

function uid(){return Date.now().toString(36) + Math.random().toString(36).slice(2,8)}

function save(){localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))}
function load(){
  try{todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []}catch(e){todos = []}
} 

function render(){
  list.innerHTML = '';
  const visible = todos.filter(t => {
    if(filter === 'all') return true;
    if(filter === 'active') return !t.completed;
    return t.completed;
  });

  visible.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');
    li.dataset.id = todo.id;

    const checkbox = document.createElement('button');
    checkbox.className = 'todo-checkbox';
    checkbox.setAttribute('aria-pressed', todo.completed);
    checkbox.title = 'Toggle completed';
    checkbox.addEventListener('click', () => toggle(todo.id));
    checkbox.innerHTML = todo.completed ? '✓' : '';

    const text = document.createElement('div');
    text.className = 'todo-text';
    text.tabIndex = 0;
    text.textContent = todo.text;
    text.setAttribute('role','textbox');
    text.addEventListener('dblclick', () => startEdit(todo.id, text));

    const dueEl = document.createElement('div');
    dueEl.className = 'todo-due';
    dueEl.textContent = todo.due ? formatDate(todo.due) : '';

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn';
    editBtn.title = 'Edit';
    editBtn.innerHTML = '✏️';
    editBtn.addEventListener('click', () => startEdit(todo.id, text)); 

    const delBtn = document.createElement('button'); 
    delBtn.className = 'action-btn';
    delBtn.title = 'Delete';
    delBtn.innerHTML = '🗑️';
    delBtn.addEventListener('click', () => remove(todo.id));

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(dueEl);
    li.appendChild(actions);

    list.appendChild(li);
  });

  const remaining = todos.filter(t=>!t.completed).length;
  countEl.textContent = `${remaining} item${remaining!==1?'s':''}`;
}

function add(text){
  const t = {id:uid(), text:text.trim(), completed:false, created:Date.now(), due: (dueInput && dueInput.value) ? dueInput.value : null};
  if(!t.text) return;
  todos.unshift(t);
  save(); render();
}

function formatDate(d){
  try{
    const dt = new Date(d);
    if(Number.isNaN(dt.getTime())) return '';
    return dt.toLocaleDateString();
  }catch(e){return ''}
}

function toggle(id){
  todos = todos.map(t => t.id===id ? {...t, completed: !t.completed} : t);
  save(); render();
}

function remove(id){
  todos = todos.filter(t=>t.id!==id);
  save(); render();
}

function startEdit(id, textNode){
  const original = textNode.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = original;
  input.className = 'todo-input';
  textNode.replaceWith(input);
  input.focus();
  input.select();

  function finish(){
    const val = input.value.trim();
    if(val){
      todos = todos.map(t => t.id===id ? {...t, text: val} : t);
    }
    save(); render();
  }

  input.addEventListener('blur', finish);
  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') finish();
    if(e.key === 'Escape'){ save(); render(); }
  });
}

function clearCompleted(){
  todos = todos.filter(t=>!t.completed);
  save(); render();
}

function setFilter(f){
  filter = f;
  filters.forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.filter===f);
    btn.setAttribute('aria-selected', String(btn.dataset.filter===f));
  });
  render();
}

// Event wiring
form.addEventListener('submit', e=>{
  e.preventDefault();
  add(input.value);
  input.value = '';
  if(dueInput) dueInput.value = '';
  input.focus();
});

filters.forEach(btn => btn.addEventListener('click', ()=> setFilter(btn.dataset.filter)));
clearBtn.addEventListener('click', clearCompleted);

// Initialize
load(); render();

// Expose for debugging (optional)
window.__TODO = {add, toggle, remove, clearCompleted, setFilter, todos};
