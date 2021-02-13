// Global container for task items
let ToDoList = [];

function AddTask(TextField) {
	// Task data-object: unique tag, input, & checkmark bool
	const Task = {
		ID: Date.now(),
		TextField,
		Checked: false,
	};

	// Push task to container & render
	ToDoList.push(Task);
	RenderTask(Task);
}

// ---------- Input ------------------
// Select first js-form element
const JSForm = document.querySelector('.js-form');

// New submission event listener
JSForm.addEventListener('submit', Event => {
	Event.preventDefault(); // Prevent auto refresh on submission

	// Select input, trim, & push if not empty string
	const Input = document.querySelector('.js-todo-input');
	const Text = Input.value.trim();

	if (Text !== '') {
		AddTask(Text);
		Input.value = ''; // Reset value
		// Auto refocus to keep adding more items in input
		Input.focus();
	}
});

// ---------- Render ------------------
function RenderTask(Task) {
	// Persist app state in browser localstorage
	localStorage.setItem('todoListRef', JSON.stringify(ToDoList))

	// Select first js-todo-list element
	// Select the current todo item in the DOM
	const List = document.querySelector('.js-todo-list');
	const Item = document.querySelector(`[data-key='${Task.ID}']`);

	// DeleteTask passed new object with delete prop
	if (Task.Deleted) {
		Item.remove();

		// Clear all whitespace from list container when ToDoList is empty
		if (ToDoList.length === 0) {
			List.innerHTML = '';
		}

		return;
	}

	// Assign 'done' to IsChecked if Checked:true, else empty str
	// Create a list element and assign it to `node`
	const IsChecked = Task.Checked ? 'done' : '';
	const Node = document.createElement("li");

	// Set the class attribute
	// Set the data-key attribute to the task id
	Node.setAttribute('class', `todo-item ${IsChecked}`);
	Node.setAttribute('data-key', Task.ID);

	// Set the contents of the `li` element created above
	Node.innerHTML = `
		<input id="${Task.ID}" type="checkbox"/>
		<label for="${Task.ID}" class="tick js-tick"></label>
		<span>${Task.TextField}</span>
		<button class="delete-todo js-delete-todo">
		<svg><use href="#delete-icon"></use></svg>
		</button>
	`;

	// Append element to DOM at end of the list. If element already exists, replace it.
	if (Item) {
		List.replaceChild(Node, Item);
	} else {
		List.append(Node);
	}
}

// ---------- Checkmark ------------------
// Select js-todo-list element
const List = document.querySelector('.js-todo-list');

// Add a click event listener to the list and its children
List.addEventListener('click', Event => {
	if (Event.target.classList.contains('js-tick')) {
		const ItemKey = Event.target.parentElement.dataset.key;
		ToggleDone(ItemKey);
	}

	if (Event.target.classList.contains('js-delete-todo')) {
		const ItemKey = Event.target.parentElement.dataset.key;
		DeleteTask(ItemKey);
	}
});

function ToggleDone(Key) {
	// findIndex is an array method that returns the position of an element in the array.
	const Index = ToDoList.findIndex(Item => Item.ID === Number(Key));

	// Locate the todo item in the todoItems array and set its checked property to the opposite. That means, `true` will become `false` and vice versa.
	ToDoList[Index].Checked = !ToDoList[Index].Checked;
	RenderTask(ToDoList[Index]);
}

// ---------- Delete ------------------
function DeleteTask(Key) {
	// Find corresponding Task object in the ToDoList array
	const Index = ToDoList.findIndex(Item => Item.ID === Number(Key));

	// Create new object with props of current Task item & a `deleted` property set to true
	const Task = {
		Deleted: true,
		...ToDoList[Index]
	};

	// Remove the Task item from the array by filtering it out
	ToDoList = ToDoList.filter(Item => Item.ID !== Number(Key));
	RenderTask(Task);
}

// ---------- Page Loaded/LocalStorage -------------
document.addEventListener('DOMContentLoaded', () => {
	// Retrieve localStorage reference
	const Ref = localStorage.getItem('todoListRef');

	// If exists, parse to convert string data back to array format and render to update page
	if (Ref) {
    	ToDoList = JSON.parse(Ref);
    	ToDoList.forEach(Task => {
      		renderTodo(Task);
    	});
  	}
});
