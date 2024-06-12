import { Children, useState } from "react";
import "./App.css";
const initialFriends = [
  {
    id: 118836,
    name: "Temilade",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -10,
  },
  {
    id: 933372,
    name: "Emako",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 40,
  },
  {
    id: 499476,
    name: "Williams",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [friendsNames, setFriendsName] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleOpenAddFriend() {
    setIsOpen(!isOpen);
  }

  function handleAddFriend(newfriend) {
    setFriendsName([...initialFriends, newfriend]);
  }

  function handleSelection(friendsObj) {
    // setSelectedFriend(friendsObj);
    setSelectedFriend((selected) =>
      selected?.id === friendsObj.id ? null : friendsObj
    );
    setIsOpen(false);
  }

  // function handleSplitBill(value) {
  //   console.log(value);
  //   setFriendsName((friends) =>
  //     friends.map((friend) =>
  //       friend.id === selectedFriend.id
  //         ? { ...friends, balance: friend.balance + value }
  //         : friend
  //     )
  //   );
  // }
  function handleSplitBill(value) {
    setFriendsName((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsComp
          friendsData={friendsNames}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />
        <FormAddFriend
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onAddFriend={handleAddFriend}
        />

        <Button onClick={handleOpenAddFriend}>
          {isOpen ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
function FriendsComp({ friendsData, onSelection, selectedFriend }) {
  // const friendsData = initialFriends;
  return (
    <ul>
      {friendsData.map((friend) => (
        <FriendsList
          friendsObj={friend}
          key={friend.name}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function FriendsList({ friendsObj, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friendsObj.id;
  // console.log(selectedFriend)
  return (
    <li className={isSelected ? "selected" : ""}>
      <img className="avatar" src={friendsObj.image} alt={friendsObj.name} />
      <div className="name-bill-box">
        <div className="name">{friendsObj.name}</div>
        <div className="bill">
          {friendsObj.balance < 0 && (
            <p className="red">
              you owe {friendsObj.name} {Math.abs(friendsObj.balance)}$
            </p>
          )}
        </div>
        <div className="bill">
          {friendsObj.balance > 0 && (
            <p className="green">
              {friendsObj.name} owes you {Math.abs(friendsObj.balance)}$
            </p>
          )}
        </div>
        <div className="bill">
          {friendsObj.balance === 0 && (
            <p>you and {friendsObj.name} are even</p>
          )}
        </div>
      </div>
      <Button onClick={() => onSelection(friendsObj)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ isOpen, onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    if (!name || !image) return;
    e.preventDefault();

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    console.log(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <>
      {isOpen && (
        <form className="form-add-friend" onClick={handleSubmit}>
          <label>friend Name</label>
          <input
            type="text"
            className="inputFields"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Image Url</label>
          <input
            className="inputFields"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <Button  >Add</Button>
        </form>
      )}
    </>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, SetBill] = useState("");
  const [paidUser, setPaidUser] = useState("");

  const paidByFriend = bill ? bill - paidUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidUser);
  }
  // const [friendExpense,setFriendExpense] = useState("")

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        className="inputFields"
        onChange={(e) => SetBill(Number(e.target.value))}
      />

      <label>Your Expense</label>
      <input
        type="text"
        value={paidUser}
        className="inputFields"

        onChange={(e) =>
          setPaidUser(
            Number(e.target.value) > bill ? paidUser : Number(e.target.value)
          )
        }
      />

      <label>{selectedFriend.name}'s Expense</label>
      <input type="text" 
        className="inputFields"
      value={paidByFriend} disabled />

      <label>Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        className="inputFields2"
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">you</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
export default App;
