// Activity 4: import useState so components can hold state
import { useState } from "react";

// Activity 1: Logo component (given in the starter code)
function Logo() {
  return <h1>My Travel List</h1>;
}

// Activity 2-5: Form component
// Activity 9d: receives onAddItems from App via props (child-to-parent communication)
function Form({ onAddItems }) {
  // Activity 4: state for the description input
  const [description, setDescription] = useState("");
  // Activity 5: state for the quantity dropdown
  const [quantity, setQuantity] = useState(1);

  // Activity 3: handle form submission without reloading the page
  function handleSubmit(e) {
    e.preventDefault();

    // Activity 8c: description must not be empty
    if (!description.trim()) return;

    // Activity 8c (1): create a new item based on the user input
    const newItem = { id: Date.now(), description, quantity, packed: false };

    // Activity 8c (2) + 9d: add the item using the function passed in via props
    onAddItems(newItem);

    // Activity 8c (3): reset the form back to the default values
    setDescription("");
    setQuantity(1);
  }

  return (
    // Activity 3: listen for the submit event
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need to pack? 🧳</h3>

      {/* Activity 2 + 5: quantity dropdown, controlled by the quantity state */}
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>

      {/* Activity 2 + 4: description input, controlled by the description state */}
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Activity 2: add button */}
      <button>Add</button>
    </form>
  );
}

// Activity 6: Item component, receives one item via props
// Step 9-10: also receives the delete and toggle handlers
function Item({ item, onDeleteItem, onToggleItem }) {
  return (
    <li>
      {/* Step 10: checkbox to mark the item as packed */}
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => onToggleItem(item.id)}
      />

      {/* Activity 7: conditional rendering, cross out packed items */}
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>

      {/* Step 9: delete button */}
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}

// Activity 6: PackingList component renders every item using <Item>
// Activity 9b: receives items from App via props instead of using initialItems
function PackingList({ items, onDeleteItem, onToggleItem, onClearList }) {
  // Step 12 (extra feature): sorting and search state
  const [sortBy, setSortBy] = useState("input");
  const [search, setSearch] = useState("");

  // Step 12: sort the items
  let sortedItems = items;
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  // Step 12: filter the items by the search text
  const visibleItems = sortedItems.filter((item) =>
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="list">
      <ul>
        {/* Activity 6: map each item to an <Item>, passing it via props */}
        {/* Activity 9b: item.id is used as the key */}
        {visibleItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>

      {/* Step 12: search box, sort dropdown and clear button */}
      <div className="actions">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={onClearList}>Clear list</button>
      </div>
    </div>
  );
}

// Step 11: Stats component calculates totals and the packed percentage
function Stats({ items }) {
  if (!items.length)
    return (
      <footer className="stats">
        <em>Start adding some items to your packing list 🚀</em>
      </footer>
    );

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "You got everything! Ready to go ✈️"
          : `You have ${numItems} items in the list. You already packed ${numPacked} (${percentage}%).`}
      </em>
    </footer>
  );
}

// App component: holds the state and the handlers
function App() {
  // Activity 8a + 9a: items state, starting as an empty array
  // (created in Form in 8a, then lifted up to App in 9a so PackingList can use it)
  const [items, setItems] = useState([]);

  // Activity 8b + 9c: add a new item without mutating state
  // (created in Form in 8b, then moved to App in 9c)
  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  // Step 9: delete an item by id
  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  // Step 10: toggle an item's packed status
  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  // Step 12: clear all items
  function handleClearList() {
    if (window.confirm("Are you sure you want to delete all items?"))
      setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      {/* Activity 9c: pass the add function to Form via prop */}
      <Form onAddItems={handleAddItems} />
      {/* Activity 9b: pass the items state to PackingList via prop */}
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}

export default App;
